package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.service.AuthenticationService;
import com.example.parking_service.utils.HttpUtils;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletRequest;
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

    @PostMapping("sign-in")
    ApiResponse<Object> authentication(
            @RequestHeader("User-Agent") String userAgent,
            @Valid @RequestBody AuthenticationRequest request) {
        return authenticationService.login(request, userAgent);
    }

    @PostMapping("/check-token")
    ApiResponse<Object> checkToken(@RequestBody CheckTokenRequest request)
            throws JOSEException {
        return authenticationService.checkToken(request);
    }

    @PostMapping("/refresh")
    ApiResponse<Object> refreshToken(@RequestBody RefreshTokenRequest request,
                                     @RequestHeader("User-Agent") String userAgent) {
        return authenticationService.refreshToken(request, userAgent);
    }

    @PostMapping("/registration")
    ApiResponse<Object> registrationAccount(@RequestBody RegistrationAccount request, HttpServletRequest http) {
        String ip = HttpUtils.getClientIp(http);
        return authenticationService.registrationAccount(request, ip);
    }

    @PostMapping("/confirm-regis")
    ApiResponse<Object> confirmRegis(@RequestParam("code") String code, HttpServletRequest http) {
        String ip = HttpUtils.getClientIp(http);
        return authenticationService.confirmRegis(code, ip);
    }


    @PostMapping("/forget")
    ApiResponse<Object> forgetAccount(@RequestBody AuthenticationRequest request, HttpServletRequest http) {
        String ip = HttpUtils.getClientIp(http);
        return authenticationService.forgetAccount(request.getUsername(), ip);
    }

    @PostMapping("/forget/confirm")
    ApiResponse<Object> confirmForget(@Valid @RequestBody ConfirmForgetRequest request, HttpServletRequest http) {
        String ip = HttpUtils.getClientIp(http);
        return authenticationService.confirmForget(request, ip);
    }
}
