package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AccountRequest;
import com.example.parking_service.service.AccountService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountController {
    AccountService accountService;

    @PostMapping("/create")
        // all role
    ApiResponse<Object> createAccount(@Valid @RequestBody AccountRequest request) {
        return accountService.createAccount(request, null);
    }

    @PostMapping("/create-by-admin")
        // role admin
    ApiResponse<Object> createAccountByAdmin(@Valid @RequestBody AccountRequest request) {
        return accountService.createAccount(request, "admin");
    }
}
