package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.*;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;

public interface AuthenticationService {
    ApiResponse<Object> login(AuthenticationRequest request, String userAgent);

    ApiResponse<Object> checkToken(CheckTokenRequest request) throws JOSEException;

    ApiResponse<Object> refreshToken(RefreshTokenRequest request, String userAgent);

    ApiResponse<Object> registrationAccount(RegistrationAccount request, String ip);

    ApiResponse<Object> confirmRegis(String code, String ip);

    ApiResponse<Object> forgetAccount(String username, String ip);

    ApiResponse<Object> confirmForget(ConfirmForgetRequest request, String ip);

    SignedJWT verifyToken(String token) throws JOSEException, ParseException;
}
