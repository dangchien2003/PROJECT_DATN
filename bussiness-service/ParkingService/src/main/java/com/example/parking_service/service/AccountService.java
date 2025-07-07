package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.CreateAccountRequest;
import com.example.parking_service.dto.request.SearchListAccountRequest;
import org.springframework.data.domain.Pageable;

public interface AccountService {
    ApiResponse<Object> createAccount(CreateAccountRequest request, String idAdmin);

    ApiResponse<Object> searchListCustomer(SearchListAccountRequest request, Pageable pageable);

    ApiResponse<Object> searchListPartner(SearchListAccountRequest request, Pageable pageable);

    ApiResponse<Object> detail(String idAccount, Integer category);

    ApiResponse<Object> suggestions(String key, Pageable pageable);

    ApiResponse<Object> getBalance();

    ApiResponse<Object> getInfoAccount();
}
