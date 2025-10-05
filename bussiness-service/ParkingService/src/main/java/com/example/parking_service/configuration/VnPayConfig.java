package com.example.parking_service.configuration;

import com.example.common.utils.TimeUtil;
import com.example.parking_service.dto.response.PayOnlineResponse;
import com.example.parking_service.enums.PaymentMethod;
import jakarta.annotation.PostConstruct;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class VnPayConfig {
    public static String VNP_TMNCODE;
    public static String SECRET_KEY;
    public static String VNP_PAYURL;
    @Value("${vnPay.tmnCode}")
    private String vnpTmnCode;
    @Value("${vnPay.secret-key}")
    private String secretKey;
    @Value("${vnPay.url-payment}")
    private String vnpPayUrl;

    public static PayOnlineResponse generateUrl(String paymentId, long amount, String ipAddress, @NotNull String paymentTypeString, String returnUrl) throws UnsupportedEncodingException {
        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";
        String orderType = "other";

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", VnPayConfig.VNP_TMNCODE);
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
        LocalDateTime expire = now.plusMinutes(30);
        String vnpExpireDate = TimeUtil.formatLocalDateTime(expire, "yyyyMMddHHmmss");
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        String queryUrl = getQueryUrl(vnpParams);
        return PayOnlineResponse.builder()
                .paymentMethod(PaymentMethod.VNPAY)
                .total(amount)
                .urlRedirect(VnPayConfig.VNP_PAYURL + "?" + queryUrl)
                .expire(expire)
                .build();
    }

    public static String getQueryUrl(Map fields) throws UnsupportedEncodingException {
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
        String vnpSecureHash = hmacSHA512(VnPayConfig.SECRET_KEY, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        return queryUrl;
    }

    public static String hmacSHA512(final String key, final String data) {
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

    @PostConstruct
    public void init() {
        VNP_TMNCODE = vnpTmnCode;
        SECRET_KEY = secretKey;
        VNP_PAYURL = vnpPayUrl;
    }
}