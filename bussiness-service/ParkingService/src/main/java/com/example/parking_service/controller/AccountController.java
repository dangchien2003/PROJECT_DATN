package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.enums.AccountCategory;
import com.example.parking_service.service.AccountService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AccountController {
    AccountService accountService;

    @PostMapping("/create")
    ApiResponse<Object> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        return accountService.createAccount(request, null);
    }

    @PostMapping("/create-by-admin")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> createAccountByAdmin(@Valid @RequestBody CreateAccountRequest request) {
        return accountService.createAccount(request, "admin");
    }

    @PostMapping("/change-info-partner")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> changeInfoPartner(@Valid @RequestBody EditInfoPartnerRequest request) {
        return accountService.changeInfoPartner(request);
    }

    @PostMapping("/search/customer")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> searchCustomer(@RequestBody SearchListAccountRequest request, Pageable pageable) {
        return accountService.searchListCustomer(request, pageable);
    }

    @PostMapping("/search/partner")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> searchPartner(@RequestBody SearchListAccountRequest request, Pageable pageable) {
        return accountService.searchListPartner(request, pageable);
    }

    @GetMapping("/customer/detail")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> detailCustomer(@RequestParam("id") String id) {
        return accountService.detail(id, AccountCategory.KHACH_HANG.getValue());
    }

    @GetMapping("/partner/detail")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> detailPartner(@RequestParam("id") String id) {
        return accountService.detail(id, AccountCategory.DOI_TAC.getValue());
    }

    @GetMapping("/suggestions")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> suggestions(@RequestParam("key") String key, Pageable pageable) {
        return accountService.suggestions(key, pageable);
    }

    @GetMapping("/balance")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> getBalance() {
        return accountService.getBalance();
    }

    @GetMapping("info")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PARTNER', 'CUSTOMER')")
    ApiResponse<Object> getInfoAccount() {
        return accountService.getInfoAccount();
    }


    @PatchMapping("change-password")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PARTNER', 'CUSTOMER')")
    ApiResponse<Object> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return accountService.changePassword(request);
    }

    @PatchMapping("change-status")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> changeStatus(@Valid @RequestBody ChangeStatusAccountRequest request) {
        return accountService.changeStatus(request);
    }

    @PatchMapping("change-info")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'PARTNER', 'CUSTOMER')")
    ApiResponse<Object> changeInfo(@Valid @RequestBody ChangeInfoRequest request) {
        if (request.getKey().equals("name")) {
            return accountService.changeName(request.getNewInfo());
        } else if (request.getKey().equals("gender")) {
            return accountService.changeSex(request.getNewInfo());
        } else if (request.getKey().equals("email")) {
            return accountService.changeEmail(request.getNewInfo());
        } else if (request.getKey().equals("phone-number")) {
            return accountService.changePhoneNumber(request.getNewInfo());
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thông tin không xác định"));
        }
    }
}
