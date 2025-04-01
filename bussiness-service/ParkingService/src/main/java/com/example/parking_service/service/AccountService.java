package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AccountRequest;

public interface AccountService {
    ApiResponse<Object> createAccount(AccountRequest request, String idAdmin);
}
