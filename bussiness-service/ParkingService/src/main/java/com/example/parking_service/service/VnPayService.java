package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.response.PayOnlineResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;

public interface VnPayService {
    PayOnlineResponse generateUrl(String paymentId, long amount, String ipAddress, String paymentTypeString, String returnUrl) throws UnsupportedEncodingException;

    ApiResponse<Object> vnpayCallbackTransaction(HttpServletRequest request);
}
