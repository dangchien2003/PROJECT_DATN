package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AuthenticationRequest;
import com.example.parking_service.dto.request.CheckTokenRequest;
import com.example.parking_service.dto.request.ConfirmForgetRequest;
import com.example.parking_service.dto.request.RegistrationAccount;
import com.nimbusds.jose.JOSEException;

public interface AuthenticationService {
    ApiResponse<Object> login(AuthenticationRequest request, String userAgent);

    ApiResponse<Object> checkToken(CheckTokenRequest request) throws JOSEException;

    ApiResponse<Object> registrationAccount(RegistrationAccount request, String ip);

    ApiResponse<Object> forgetAccount(String username, String ip);

    ApiResponse<Object> confirmForget(ConfirmForgetRequest request, String ip);

}
