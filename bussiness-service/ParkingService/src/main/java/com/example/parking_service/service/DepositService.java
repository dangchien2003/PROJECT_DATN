package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AddDepositRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

import java.io.UnsupportedEncodingException;

public interface DepositService {
    ApiResponse<Object> requestDeposit(AddDepositRequest request, HttpServletRequest http) throws UnsupportedEncodingException;

    ApiResponse<Object> getHistory(Pageable pageable);

    ApiResponse<Object> cancelRequest(Long id);
}
