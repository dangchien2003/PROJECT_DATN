package com.example.parking_service.service;

import com.example.common.dto.request.CheckTokenRequest;
import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AuthenticationRequest;
import com.example.parking_service.dto.request.ConfirmForgetRequest;
import com.example.parking_service.dto.request.RefreshTokenRequest;
import com.example.parking_service.dto.request.RegistrationAccount;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;

public interface AuthenticationService {
    ApiResponse<Object> login(AuthenticationRequest request, String userAgent, String domain);

    ApiResponse<Object> checkToken(CheckTokenRequest request) throws JOSEException;

    ApiResponse<Object> refreshToken(RefreshTokenRequest request, String userAgent);

    ApiResponse<Object> registrationAccount(RegistrationAccount request, String ip, String domain);

    ApiResponse<Object> confirmRegis(String code, String ip);

    ApiResponse<Object> forgetAccount(String username, String ip);

    ApiResponse<Object> confirmForget(ConfirmForgetRequest request, String ip);

    SignedJWT verifyToken(String token) throws JOSEException, ParseException;
}
