package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.TimeUtil;
import com.example.parking_service.dto.request.VnPayCheckTransactionRequest;
import com.example.parking_service.dto.response.PayOnlineResponse;
import com.example.parking_service.dto.response.VnPayCheckTransactionResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.entity.Deposit;
import com.example.parking_service.entity.Payment;
import com.example.parking_service.enums.*;
import com.example.parking_service.httpClient.VnPayClient;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.repository.DepositRepository;
import com.example.parking_service.repository.OrderRepository;
import com.example.parking_service.repository.PaymentRepository;
import com.example.parking_service.service.VnPayService;
import com.example.parking_service.utils.HttpUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class VnPayServiceImpl implements VnPayService {
    private final AccountRepository accountRepository;

    PaymentRepository paymentRepository;
    DepositRepository depositRepository;
    OrderRepository orderRepository;
    VnPayClient vnPayClient;
    @NonFinal
    @Value("${vnPay.tmnCode}")
    String vnpTmnCode;
    @NonFinal
    @Value("${vnPay.secret-key}")
    String secretKey;
    @NonFinal
    @Value("${vnPay.url-payment}")
    String vnpPayUrl;
    @NonFinal
    @Value("${vnPay.api-url}")
    String url1;

    @Override
    public PayOnlineResponse generateUrl(String paymentId, long amount, String ipAddress, @NotNull String paymentTypeString, String returnUrl) throws UnsupportedEncodingException {
        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";
        String orderType = "other";

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", paymentId);
        vnpParams.put("vnp_OrderInfo", "Thanh toan yeu cau " + paymentTypeString.toLowerCase() + " cho don hang: " + paymentId);
        vnpParams.put("vnp_OrderType", orderType);
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", returnUrl);
        vnpParams.put("vnp_IpAddr", ipAddress);

        LocalDateTime now = LocalDateTime.now();
        String vnpCreateDate = TimeUtil.formatLocalDateTime(now, "yyyyMMddHHmmss");
        vnpParams.put("vnp_CreateDate", vnpCreateDate);
        LocalDateTime expire = now.plusMinutes(5);
        String vnpExpireDate = TimeUtil.formatLocalDateTime(expire, "yyyyMMddHHmmss");
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        String queryUrl = this.getQueryUrl(vnpParams);
        return PayOnlineResponse.builder()
                .paymentMethod(PaymentMethod.VNPAY)
                .total(amount)
                .urlRedirect(vnpPayUrl + "?" + queryUrl)
                .expire(expire)
                .build();
    }

    @Override
    public ApiResponse<Object> vnpayCallbackTransaction(HttpServletRequest request) {
        Map<String, String[]> params = request.getParameterMap();
//        Kiểm tra tính toán vẹn của param
//        if (!isValidVnPayCallback(params))
//            throw new AppException(ErrorCode.VALIDATE_INFO_PAYMENT_ERROR);

        String vnpRequestId = UUID.randomUUID().toString();
        String vnpVersion = "2.1.0";
        String vnpCommand = "querydr";
        String vnpTxnRef = params.get("vnp_TxnRef")[0];
        String paymentDate = params.get("vnp_PayDate")[0];
        String ipAddress = HttpUtils.getClientIp(request);
        String vnpOrderInfo = "Kiem tra ket qua GD OrderId:" + vnpTxnRef;
        // kiểm tra giao dịch
        Payment payment = paymentRepository.findById(vnpTxnRef).orElse(null);
        if (payment == null) {
            throw new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy giao dịch: " + vnpTxnRef));
        }
        if (payment.getStatus().equals(PaymentStatus.THANH_CONG))
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Giao dịch: " + vnpTxnRef + " (đã thanh toán thành công)"));
        // kiểm tra giao dịch với vnpay
        String vnpCreateDate = TimeUtil.formatLocalDateTime(payment.getCreatedAt(), "yyyyMMddHHmmss");
        // dữ liệu để hash
        String hashData = String.join("|", vnpRequestId, vnpVersion, vnpCommand, vnpTmnCode, vnpTxnRef, paymentDate, vnpCreateDate, ipAddress, vnpOrderInfo);
        String vnpSecureHash = this.hmacSHA512(secretKey, hashData);
        // call vnpay
        VnPayCheckTransactionRequest checkRequest = VnPayCheckTransactionRequest.builder()
                .vnpRequestId(vnpRequestId)
                .vnpVersion(vnpVersion)
                .vnpCommand(vnpCommand)
                .vnpTmnCode(vnpTmnCode)
                .vnpTxnRef(vnpTxnRef)
                .vnpOrderInfo(vnpOrderInfo)
                .vnpTransactionDate(paymentDate)
                .vnpCreateDate(vnpCreateDate)
                .vnpIpAddr(ipAddress)
                .vnpSecureHash(vnpSecureHash)
                .build();
        // kết quả kiểm tra giao dịch
        VnPayCheckTransactionResponse response = vnPayClient.checkTransaction(checkRequest);
        updateStatusPayment(payment, response, "VNPAY");
        try {
            processBusiness(payment, response, "VNPAY");
        } catch (Exception e) {
            // câp nhật trạng thái nếu giao dịch thành công nhưng xử lý lỗi
            if (payment.getStatus().equals(PaymentStatus.THANH_CONG)) {
                payment.setStatus(PaymentStatus.THANH_CONG_NHUNG_LOI_XU_LY);
                DataUtils.setDataAction(payment, "VNPAY", false);
                paymentRepository.save(payment);
            }
        }

        return ApiResponse.builder()
                .result(payment.getStatus())
                .build();
    }

    void processBusiness(Payment payment, VnPayCheckTransactionResponse response, String actionBy) {
        if (payment.getType().equals(PaymentType.NAP_TIEN)) {
            processCallbackTransactionDeposit(payment.getObjectId(), response.getVnpTransactionStatus(), actionBy);
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Chưa xử lý giao dịch cho nghiệp vụ này"));
        }
    }

    void updateStatusPayment(Payment payment, VnPayCheckTransactionResponse response, String actionBy) {
        // cập nhật trạng thái giao dịch
        if (response.getVnpTransactionStatus().equals(VNPAYTransactionStatus.S_00.getStatus())) {
            // thành công
            payment.setStatus(PaymentStatus.THANH_CONG);
        } else if (response.getVnpTransactionStatus().equals(VNPAYTransactionStatus.S_01.getStatus())) {
            // chưa hoàn tất
            payment.setStatus(PaymentStatus.DANG_XU_LY);
        } else {
            // thất bại
            if (response.getVnpTransactionStatus().equals(VNPAYTransactionStatus.S_08.getStatus())) {
                payment.setStatus(PaymentStatus.HET_HAN);
            } else if (response.getVnpTransactionStatus().equals(VNPAYTransactionStatus.S_11.getStatus())) {
                payment.setStatus(PaymentStatus.HUY_GIAO_DICH);
            } else {
                payment.setStatus(PaymentStatus.LOI_GIAO_DICH);
            }
            payment.setReasonFail(VNPAYTransactionStatus.valueOf("S_" + response.getVnpTransactionStatus()).getDescription());
        }
        DataUtils.setDataAction(payment, actionBy, false);
        paymentRepository.save(payment);
    }


    void processCallbackTransactionDeposit(String depositId, String transactionStatus, String actionBy) {
        Deposit deposit = depositRepository.findById(Long.parseLong(depositId))
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        Integer newDepositStatus = null;
        // lấy trạng thái
        if (transactionStatus.equals(VNPAYTransactionStatus.S_00.getStatus())) {
            // thành công
            newDepositStatus = DepositStatus.HOAN_THANH;
        } else if (!transactionStatus.equals(VNPAYTransactionStatus.S_01.getStatus())) {
            // thất bại
            newDepositStatus = DepositStatus.THAT_BAI;
        }
        // xử lý
        try {
            if (newDepositStatus != null) {
                if (newDepositStatus.equals(DepositStatus.HOAN_THANH)) {
                    // cônng thêm tiền vào tk
                    Account account = accountRepository.findById(deposit.getAccountId())
                            .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy tài khoản")));
                    account.setBalance(account.getBalance() + deposit.getTotal());
                    DataUtils.setDataAction(account, actionBy, false);
                    accountRepository.save(account);
                }
                // cập nhật yêu cầu nạp tiền
                deposit.setStatus(newDepositStatus);
                DataUtils.setDataAction(deposit, actionBy, false);
                depositRepository.save(deposit);
            }
        } catch (Exception e) {
            // cập nhật trạng thái nếu có lỗi
            if (e instanceof AppException) {
                deposit.setStatus(DepositStatus.THAT_BAI);
            }
            DataUtils.setDataAction(deposit, actionBy, false);
            depositRepository.save(deposit);
            throw e;
        }

    }

    boolean isValidVnPayCallback(Map<String, String[]> queryParams) {
        Map<String, String> flatParams = new LinkedHashMap<>();
        for (Map.Entry<String, String[]> entry : queryParams.entrySet()) {
            flatParams.put(entry.getKey(), entry.getValue()[0]);
        }

        String receivedHash = flatParams.get("vnp_SecureHash");
        if (receivedHash == null) {
            return false;
        }
        flatParams.remove("vnp_SecureHash");

        List<String> keys = new ArrayList<>(flatParams.keySet());

        StringBuilder data = new StringBuilder();
        for (String key : keys) {
            if (data.length() > 0) {
                data.append("&");
            }
            data.append(key).append("=").append(flatParams.get(key));
        }

        String calculatedHash = this.hmacSHA512(secretKey, data.toString());

        return receivedHash.equalsIgnoreCase(calculatedHash);
    }

    public String getQueryUrl(Map fields) throws UnsupportedEncodingException {
        List fieldNames = new ArrayList(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnpSecureHash = hmacSHA512(secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        return queryUrl;
    }

    public String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }


    public String hmacSHA256(final String key, final String data) {
        try {

            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA256");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA256");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }

}
