package com.example.parking_service.service.impl;

import com.example.common.dto.kafka.PushNotifyRequest;
import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.TimeUtil;
import com.example.parking_service.configuration.VnPayConfig;
import com.example.parking_service.dto.request.VnPayCheckTransactionRequest;
import com.example.parking_service.dto.response.VnPayCheckTransactionResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.entity.Deposit;
import com.example.parking_service.entity.OrderParking;
import com.example.parking_service.entity.Payment;
import com.example.parking_service.enums.*;
import com.example.parking_service.httpClient.VnPayClient;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.repository.DepositRepository;
import com.example.parking_service.repository.OrderRepository;
import com.example.parking_service.repository.PaymentRepository;
import com.example.parking_service.service.NotifyService;
import com.example.parking_service.service.TicketPurchasedService;
import com.example.parking_service.service.VnPayService;
import com.example.parking_service.utils.HttpUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
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
    TicketPurchasedService ticketPurchasedService;
    VnPayClient vnPayClient;
    NotifyService notifyService;

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
        String hashData = String.join("|", vnpRequestId, vnpVersion, vnpCommand, VnPayConfig.VNP_TMNCODE, vnpTxnRef, paymentDate, vnpCreateDate, ipAddress, vnpOrderInfo);
        String vnpSecureHash = VnPayConfig.hmacSHA512(VnPayConfig.SECRET_KEY, hashData);
        // call vnpay
        VnPayCheckTransactionRequest checkRequest = VnPayCheckTransactionRequest.builder()
                .vnpRequestId(vnpRequestId)
                .vnpVersion(vnpVersion)
                .vnpCommand(vnpCommand)
                .vnpTmnCode(VnPayConfig.VNP_TMNCODE)
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
            log.error("eror: ", e);
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

    void processBusiness(Payment payment, VnPayCheckTransactionResponse response, String actionBy) throws JsonProcessingException {
        if (payment.getType().equals(PaymentType.NAP_TIEN)) {
            processCallbackTransactionDeposit(payment.getObjectId(), response.getVnpTransactionStatus(), actionBy);
        } else if (payment.getType().equals(PaymentType.MUA_VE)) {
            processCallbackTransactionBuyTicket(payment.getObjectId(), response.getVnpTransactionStatus(), actionBy);
        } else if (payment.getType().equals(PaymentType.GIA_HAN)) {
            ticketPurchasedService.processExtendTicketSuccess(payment.getObjectId(), payment.getTotal(), actionBy);
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
                try {
                    // gửi thông báo
                    PushNotifyRequest pushNotifyRequest1 = PushNotifyRequest.builder()
                            .to(deposit.getAccountId())
                            .title("Nạp tiền thành công")
                            .content(String.format("Tài khoản của bạn đã được cộng thêm %dđ", deposit.getTotal()))
                            .link("/account/transaction")
                            .actionBy(deposit.getAccountId())
                            .build();
                    notifyService.pushNotify(pushNotifyRequest1);
                } catch (Exception e) {
                    log.error("send notify error", e);
                }
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

    void processCallbackTransactionBuyTicket(String orderId, String transactionStatus, String actionBy) throws JsonProcessingException {
        OrderParking order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        Integer newOrderStatus = null;
        // lấy trạng thái
        if (transactionStatus.equals(VNPAYTransactionStatus.S_00.getStatus())) {
            // thành công
            newOrderStatus = OrderStatus.THANH_CONG;
        } else if (!transactionStatus.equals(VNPAYTransactionStatus.S_01.getStatus())) {
            // thất bại
            newOrderStatus = OrderStatus.THAT_BAI;
        }
        // xử lý
        try {
            if (newOrderStatus != null) {
                // cập nhật trạng thái đơn hàng
                order.setStatus(newOrderStatus);
                DataUtils.setDataAction(order, actionBy, false);
                orderRepository.save(order);
                // xử lý cấp vé nếu hoàn thành
                if (newOrderStatus.equals(OrderStatus.THANH_CONG)) {
                    ticketPurchasedService.processBuyTicketSuccess(order);
                }
            }
        } catch (Exception e) {
            // cập nhật trạng thái nếu có lỗi
            if (e instanceof AppException) {
                order.setStatus(OrderStatus.THAT_BAI);
            }
            DataUtils.setDataAction(order, actionBy, false);
            orderRepository.save(order);
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

        String calculatedHash = VnPayConfig.hmacSHA512(VnPayConfig.SECRET_KEY, data.toString());

        return receivedHash.equalsIgnoreCase(calculatedHash);
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
