package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.CreateAccountRequest;
import com.example.parking_service.dto.request.SearchListCustomerRequest;
import org.springframework.data.domain.Pageable;

public interface AccountService {
    ApiResponse<Object> createAccount(CreateAccountRequest request, String idAdmin);

    ApiResponse<Object> searchListCustomer(SearchListCustomerRequest request, Pageable pageable);
}
