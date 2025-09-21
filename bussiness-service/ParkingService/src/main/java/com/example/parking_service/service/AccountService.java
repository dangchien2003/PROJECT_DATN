package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.*;
import org.springframework.data.domain.Pageable;

public interface AccountService {
    ApiResponse<Object> changeInfoPartner(EditInfoPartnerRequest request);

    ApiResponse<Object> createAccount(CreateAccountRequest request, String idAdmin);

    ApiResponse<Object> searchListCustomer(SearchListAccountRequest request, Pageable pageable);

    ApiResponse<Object> searchListPartner(SearchListAccountRequest request, Pageable pageable);

    ApiResponse<Object> detail(String idAccount, Integer category);

    ApiResponse<Object> suggestions(String key, Pageable pageable);

    ApiResponse<Object> getBalance();

    ApiResponse<Object> getInfoAccount();

    ApiResponse<Object> changePassword(ChangePasswordRequest request);

    ApiResponse<Object> changeStatus(ChangeStatusAccountRequest request);

    ApiResponse<Object> changeName(String newName);

    ApiResponse<Object> changeEmail(String newEmail);

    ApiResponse<Object> changePhoneNumber(String newPhoneNumber);

    ApiResponse<Object> changeSex(String newSex);
}
