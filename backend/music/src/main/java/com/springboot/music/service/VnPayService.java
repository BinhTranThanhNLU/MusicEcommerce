package com.springboot.music.service;

import com.springboot.music.entity.OrderEntity;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VnPayService {

    @Value("${vnpay.tmn-code:}")
    private String tmnCode;

    @Value("${vnpay.hash-secret:}")
    private String hashSecret;

    @Value("${vnpay.pay-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String payUrl;

    @Value("${app.frontend.checkout-url:http://localhost:5173/cart}")
    private String frontendCheckoutUrl;

    public String createPaymentUrl(OrderEntity order, HttpServletRequest request) {
        requireConfig();

        // Dùng Asia/Ho_Chi_Minh an toàn hơn GMT+7 trong Java
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        formatter.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        String vnp_CreateDate = formatter.format(cld.getTime());
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", String.valueOf(Math.round(order.getTotalAmount() * 100)));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", String.valueOf(order.getId()));
        params.put("vnp_OrderInfo", "Thanh toan don hang " + order.getId());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", buildBackendReturnUrl(request));
        params.put("vnp_IpAddr", getClientIp(request));
        params.put("vnp_CreateDate", vnp_CreateDate);
        params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Xây dựng chuỗi Hash và chuỗi URL tách biệt theo chuẩn VNPay
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (Map.Entry<String, String> entry : params.entrySet()) {
            String fieldName = entry.getKey();
            String fieldValue = entry.getValue();

            if (fieldValue != null && !fieldValue.isBlank()) {
                // 1. Chuỗi để băm (hashData): KHÔNG encode fieldName
                if (!hashData.isEmpty()) {
                    hashData.append('&');
                }
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                // 2. Chuỗi gắn lên URL (query): Encode cả fieldName lẫn fieldValue
                if (!query.isEmpty()) {
                    query.append('&');
                }
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            }
        }

        String queryUrl = query.toString();
        String secureHash = hmacSHA512(hashSecret, hashData.toString());

        return payUrl + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;
    }

    public boolean verifyReturn(Map<String, String> params) {
        if (params == null || params.isEmpty()) {
            return false;
        }

        // Lấy chữ ký do VNPay gửi về
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null || receivedHash.isBlank()) {
            return false;
        }

        // Lọc và sắp xếp lại các tham số (bỏ vnp_SecureHash và vnp_SecureHashType)
        Map<String, String> cleanParams = new TreeMap<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if (key != null && value != null && !value.isBlank()
                    && !"vnp_SecureHash".equalsIgnoreCase(key)
                    && !"vnp_SecureHashType".equalsIgnoreCase(key)) {
                cleanParams.put(key, value);
            }
        }

        // Tạo lại chuỗi Hash Data y hệt như lúc gửi đi
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : cleanParams.entrySet()) {
            if (!hashData.isEmpty()) {
                hashData.append('&');
            }
            // Decode value do Spring Boot tự động decode khi nhận RequestParam
            hashData.append(entry.getKey()).append('=').append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
        }

        // Băm lại chuỗi và so sánh
        String expectedHash = hmacSHA512(hashSecret, hashData.toString());
        return expectedHash.equalsIgnoreCase(receivedHash);
    }

    public String getFrontendCheckoutUrl() {
        return frontendCheckoutUrl;
    }

    private void requireConfig() {
        if (tmnCode == null || tmnCode.isBlank() || hashSecret == null || hashSecret.isBlank()) {
            throw new RuntimeException("VNPay configuration is missing. Please set vnpay.tmn-code and vnpay.hash-secret.");
        }
    }

    private String buildBackendReturnUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String host = request.getServerName();
        int port = request.getServerPort();
        String contextPath = request.getContextPath();
        StringBuilder url = new StringBuilder();
        url.append(scheme).append("://").append(host);
        if (!("http".equalsIgnoreCase(scheme) && port == 80) && !("https".equalsIgnoreCase(scheme) && port == 443)) {
            url.append(":").append(port);
        }
        if (contextPath != null) {
            url.append(contextPath);
        }
        url.append("/orders/vnpay/return");
        return url.toString();
    }

    private String getClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return normalizeIp(forwardedFor.split(",")[0].trim());
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return normalizeIp(realIp.trim());
        }
        return normalizeIp(request.getRemoteAddr());
    }

    private String normalizeIp(String ipAddress) {
        if (ipAddress == null || ipAddress.isBlank() || "0:0:0:0:0:0:0:1".equals(ipAddress) || "::1".equals(ipAddress)) {
            return "127.0.0.1";
        }
        return ipAddress;
    }

    private String buildQueryString(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getValue() == null || entry.getValue().isBlank()) {
                continue;
            }
            if (!query.isEmpty()) {
                query.append('&');
            }
            query.append(encode(entry.getKey())).append('=').append(encode(entry.getValue()));
        }
        return query.toString();
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }

    private String hmacSHA512(String secret, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(bytes.length * 2);
            for (byte b : bytes) {
                String hexByte = Integer.toHexString(b & 0xff);
                if (hexByte.length() == 1) {
                    hex.append('0');
                }
                hex.append(hexByte);
            }
            return hex.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate VNPay secure hash", ex);
        }
    }
}

