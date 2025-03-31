package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AccountRequest;
import com.example.parking_service.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/create")
    ApiResponse<Object> createAccount(@Valid @RequestBody AccountRequest request) {
        return authenticationService.createAccount(request, null);
    }

    @GetMapping("/get")
    ApiResponse<Object> getTesst() {
        return ApiResponse.builder()
                .result("abc")
                .build();
    }


    @PostMapping("/create/admin")
    ApiResponse<Object> createAccountByAdmin(@Valid @RequestBody AccountRequest request) {
        return authenticationService.createAccount(request, "admin");
    }

    @PostMapping("/create/partner")
    ApiResponse<Object> createPartner(@Valid @RequestBody AccountRequest request) {
        System.out.println(request);
        return null;
    }
}
