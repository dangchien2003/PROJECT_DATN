package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.client.GoogleProfileClient;
import com.example.parking_service.client.GoogleTokenClient;
import com.example.parking_service.dto.request.AuthenticationRequest;
import com.example.parking_service.dto.request.CheckTokenRequest;
import com.example.parking_service.dto.request.GoogleAccessTokenRequest;
import com.example.parking_service.dto.response.GoogleAccessTokenResponse;
import com.example.parking_service.dto.response.GoogleUserProfileResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.enums.AccountCategory;
import com.example.parking_service.enums.AccountStatus;
import com.example.parking_service.enums.AuthenType;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.service.AuthenticationService;
import com.example.parking_service.utils.UserUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    AccountRepository accountRepository;
    GoogleTokenClient googleTokenClient;
    GoogleProfileClient googleProfileClient;
    ObjectMapper objectMapper;
    String redirectUriForRegister = "http://localhost:3000/register";
    String redirectUriForAuth = "http://localhost:3000/authen";

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    String clientId;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    String clientSecret;

    @NonFinal
    @Value("${auth.token.time-live-access-token}")
    int timeLiveAccessToken;

    @NonFinal
    @Value("${auth.token.time-live-refresh-token}")
    int timeLiveRefreshToken;

    @NonFinal
    @Value("${auth.token.secret-key}")
    String secretKey;

    @NonFinal
    @Value("${auth.check-user-agent}")
    boolean checkUserAgent;

    @Override
    public ApiResponse<Object> checkToken(CheckTokenRequest request)
            throws JOSEException {
        if (DataUtils.isNullOrEmpty(request.getToken())) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        boolean isValid = true;

        try {
            verifyToken(request.getToken());
        } catch (AppException | ParseException e) {
            log.error("erorr: ", e);
            isValid = false;
        }

        return ApiResponse.builder()
                .result(isValid)
                .build();
    }

    SignedJWT verifyToken(String token)
            throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(secretKey.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        boolean verified = signedJWT.verify(verifier);

        if (!verified
                || !expiryTime.after(new Date())
//                || tokenRepository
//                .existsByTokenIdAndReject(signedJWT.getJWTClaimsSet().getJWTID(), TokenStatus.REJECT) // kiểm tra danh sách đen
        ) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }

    @Override
    public ApiResponse<Object> login(AuthenticationRequest request, String userAgent) {
        // lỗi khi không call từ trình duyệt
        if (checkUserAgent && !UserUtils.isValidUserAgent(userAgent)) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        Account account = null;
        if (Objects.equals(request.getType(), AuthenType.GOOGLE)) {
            account = this.authByGoogle(request);
            if (!account.getCategory().equals(AccountCategory.KHACH_HANG.getValue())) {
                account = null;
            }
        } else if (Objects.equals(request.getType(), AuthenType.USERNAME_PASSWORD)) {
            account = this.authByUsernamePassword(request);
        } else {
            throw new AppException(ErrorCode.INVALID_DATA);
        }

        if (account == null) {
            throw new AppException(ErrorCode.NOT_FOUND.withMessage("Tài khoản không tồn tại hoặc mật khẩu không chính xác"));
        }

        // kiểm tra trạng thái
        if (account.getStatus().equals(AccountStatus.KHOA_TAM_THOI.getValue())
                || account.getStatus().equals(AccountStatus.KHOA_TAI_KHOAN.getValue())) {
            throw new AppException(ErrorCode.NO_ACCESS.withMessage("Tài khoản đã bị khoá, vui lòng liên hệ hỗ trợ để giải quyết"));
        }
        // trả kết quả
        try {
            return ApiResponse.builder()
                    .result(UserUtils.createAuthenticationResponse(
                            account, userAgent, secretKey, timeLiveAccessToken, timeLiveRefreshToken, objectMapper))
                    .build();
        } catch (Exception e) {
            log.error("Authentication error:", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    Account authByUsernamePassword(AuthenticationRequest request) {
        Account account = null;
        // validate
        if (DataUtils.isNullOrEmpty(request.getUsername())
                || DataUtils.isNullOrEmpty(request.getPassword())) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        // kiểm tra tài khoản
        List<Account> accounts = accountRepository.findAllByEmailOrPhoneNumber(request.getUsername(), request.getUsername());
        if (!accounts.isEmpty()) {
            account = accounts.getFirst();
            // kiểm tra mật khâu
            if (account.getPassword().equals(request.getPassword())) {
                account = accounts.getFirst();
            }
        }
        return account;
    }

    Account authByGoogle(AuthenticationRequest request) {
        // validate
        if (DataUtils.isNullOrEmpty(request.getAuthorizationCode())
                || DataUtils.isNullOrEmpty(request.getCodeVerifier())) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        // lấy thông tin tài khoản google
        GoogleUserProfileResponse googleUserProfileResponse = this.getInfoGoogleAccount(request.getAuthorizationCode(), request.getCodeVerifier(), redirectUriForRegister);
        // kiểm tra thông tin tài khoản
        Optional<Account> accountOptional = accountRepository.findByEmail(googleUserProfileResponse.getEmail());
        return accountOptional.orElse(null);
    }

    public GoogleUserProfileResponse getInfoGoogleAccount(String authorizationCode, String codeVerifier, String redirectUri) {
        GoogleAccessTokenRequest googleAccessTokenRequest =
                this.createBodyGoogleApiGetAccessToken(authorizationCode, codeVerifier, redirectUri);

        GoogleAccessTokenResponse response;
        try {
            response = googleTokenClient.getAccessToken(googleAccessTokenRequest);
        } catch (Exception e) {
            log.error("error: ", e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return googleProfileClient.getProfile("Bearer " + response.getAccess_token());
    }

    GoogleAccessTokenRequest createBodyGoogleApiGetAccessToken(String authorizationCode, String codeVerifier, String redirectUri) {
        return GoogleAccessTokenRequest.builder()
                .code(authorizationCode)
                .code_verifier(codeVerifier)
                .client_id(clientId)
                .client_secret(clientSecret)
                .redirect_uri(redirectUri)
                .build();
    }
}
