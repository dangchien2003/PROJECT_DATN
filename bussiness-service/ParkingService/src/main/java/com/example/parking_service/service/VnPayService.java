package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface VnPayService {
    ApiResponse<Object> vnpayCallbackTransaction(HttpServletRequest request);
}
