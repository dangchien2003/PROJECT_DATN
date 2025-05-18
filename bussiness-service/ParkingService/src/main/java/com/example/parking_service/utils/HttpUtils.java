package com.example.parking_service.utils;

import jakarta.servlet.http.HttpServletRequest;

public class HttpUtils {
    public static String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0]; // nếu dùng proxy/nginx
    }
}
