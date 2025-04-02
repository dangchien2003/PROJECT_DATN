package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.CreateAccountRequest;

public interface AccountService {
    ApiResponse<Object> createAccount(CreateAccountRequest request, String idAdmin);
}
