package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.CreateAccountRequest;
import com.example.parking_service.dto.request.SearchListAccountRequest;
import com.example.parking_service.enums.AccountCategory;
import com.example.parking_service.service.AccountService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountController {
    AccountService accountService;

    @PostMapping("/create")
        // all role
    ApiResponse<Object> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        return accountService.createAccount(request, null);
    }

    @PostMapping("/create-by-admin")
        // role admin
    ApiResponse<Object> createAccountByAdmin(@Valid @RequestBody CreateAccountRequest request) {
        return accountService.createAccount(request, "admin");
    }

    @PostMapping("/search/customer")
        // role admin
    ApiResponse<Object> searchCustomer(@RequestBody SearchListAccountRequest request, Pageable pageable) {
        return accountService.searchListCustomer(request, pageable);
    }

    @PostMapping("/search/partner")
        // role admin
    ApiResponse<Object> searchPartner(@RequestBody SearchListAccountRequest request, Pageable pageable) {
        return accountService.searchListPartner(request, pageable);
    }

    @GetMapping("/customer/detail")
        // role admin
    ApiResponse<Object> detailCustomer(@RequestParam("id") String id) {
        return accountService.detail(id, AccountCategory.KHACH_HANG.getValue());
    }

    @GetMapping("/partner/detail")
        // role admin
    ApiResponse<Object> detailPartner(@RequestParam("id") String id) {
        return accountService.detail(id, AccountCategory.DOI_TAC.getValue());
    }

}
