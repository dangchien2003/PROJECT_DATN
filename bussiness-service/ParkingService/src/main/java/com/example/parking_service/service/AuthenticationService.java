package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AuthenticationRequest;
import com.example.parking_service.dto.request.CheckTokenRequest;
import com.nimbusds.jose.JOSEException;

public interface AuthenticationService {
    ApiResponse<Object> login(AuthenticationRequest request, String userAgent);

    ApiResponse<Object> checkToken(CheckTokenRequest request) throws JOSEException;
}
