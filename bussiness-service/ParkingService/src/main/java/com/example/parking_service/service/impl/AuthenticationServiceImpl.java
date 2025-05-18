package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.enums.TimeUnit;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.RandomUtils;
import com.example.common.utils.RegexUtils;
import com.example.parking_service.client.GoogleProfileClient;
import com.example.parking_service.client.GoogleTokenClient;
import com.example.parking_service.dto.other.DataForget;
import com.example.parking_service.dto.other.DataOtp;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.dto.response.GoogleAccessTokenResponse;
import com.example.parking_service.dto.response.GoogleUserProfileResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.enums.*;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.service.AuthenticationService;
import com.example.parking_service.utils.UserUtils;
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
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    // tạm lưu cache tại đây
    Map<String, Account> cacheAccount = new HashMap<>();
    Map<String, DataOtp> cacheAccountForget = new HashMap<>();
    AccountRepository accountRepository;
    GoogleTokenClient googleTokenClient;
    GoogleProfileClient googleProfileClient;

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

    @NonFinal
    @Value("${auth.forget.length-otp}")
    int lengthOtpForget;

    @NonFinal
    @Value("${auth.forget.time-quality}")
    int timeQualityForget;

    @NonFinal
    @Value("${auth.forget.time-unit}")
    String timeUnitForget;

    @Override
    public ApiResponse<Object> confirmForget(ConfirmForgetRequest request, String ip) {
        DataOtp dataOtp = cacheAccountForget.get(request.getId());
        if (dataOtp == null) {
            throw new AppException(ErrorCode.NOT_FOUND.withMessage("Yêu cầu đã hết hạn. Vui lòng thao tác lại"));
        }
        // check ip
        if (!dataOtp.getIp().equals(ip)) {
            throw new AppException(ErrorCode.NO_ACCESS);
        }
        // check thời hạn
        if (dataOtp.getDataForget().getExpire().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.NOT_FOUND.withMessage("Yêu cầu đã hết hạn. Vui lòng thao tác lại"));
        }
        // check otp
        if (!dataOtp.getOtp().equals(request.getOtp())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Mã otp không hợp lệ"));
        }
        // thay đổi dữ liệu
        Account account = accountRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        String newPassword = RandomUtils.generatePassword(10);
        account.setPassword(newPassword);
        account.setPermitChangePassword(PermitChangePassword.CHUA_THAY_DOI);
        DataUtils.setDataAction(account, ip, false);
        accountRepository.save(account);
        cacheAccountForget.remove(request.getId());
        return ApiResponse.builder()
                .result(account.getEmail())
                .build();
    }

    @Override
    public ApiResponse<Object> forgetAccount(String username, String ip) {
        // validate
        if (DataUtils.isNullOrEmpty(username) || DataUtils.isNullOrEmpty(ip)) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        // lấy dữ liệu
        List<Account> accounts = accountRepository.findAllByEmailOrPhoneNumber(username, username);
        if (accounts.isEmpty()) {
            throw new AppException(ErrorCode.NOT_FOUND.withMessage("Tài khoản chưa tồn tại. Vui lòng thử lại."));
        }
        Account account = accounts.getFirst();
        // lấy loại username
        int category = UsernameCategory.PHONE_NUMBER;
        if (RegexUtils.checkData(username, RegexUtils.REGEX_EMAIL)) {
            category = UsernameCategory.EMAIL;
        }
        // data response
        DataForget dataForget = DataForget.builder()
                .id(account.getId())
                .expire(LocalDateTime.now().plus(timeQualityForget, TimeUnit.valueOf(timeUnitForget).getUnit()))
                .category(category)
                .length(lengthOtpForget)
                .build();
        // cata cache
        DataOtp dataOtp = DataOtp.builder()
                .otp(RandomUtils.randomNumber(lengthOtpForget))
                .ip(ip)
                .dataForget(dataForget)
                .build();
        // cache
        cacheAccountForget.put(account.getId(), dataOtp);
        System.out.println(dataOtp);
        return ApiResponse.builder()
                .result(dataForget)
                .build();
    }

    @Override
    public ApiResponse<Object> registrationAccount(RegistrationAccount request, String ip) {
        if (request.getType() == null) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        String email = null;
        if (request.getType().equals(AuthenType.USERNAME_PASSWORD)) {
            email = request.getEmail();
            String password = request.getPassword();
            validateRegisAccountForEP(email, password);
            Account account = Account.builder()
                    .email(email)
                    .password(password)
                    .category(AccountCategory.KHACH_HANG.getValue())
                    .status(AccountStatus.DANG_HOAT_DONG.getValue())
                    .balance(0L)
                    .build();
            DataUtils.setDataAction(account, ip, true);
            // cache
            cacheAccount.put(account.getEmail(), account);
            // gửi mail kafka
        } else if (request.getType().equals(AuthenType.GOOGLE)) {
            System.out.println("tạo tk bằng google");
        } else {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        return ApiResponse.builder()
                .result(email)
                .build();
    }

    void validateRegisAccountForEP(String email, String password) {
        // validate email
        if (DataUtils.isNullOrEmpty(email)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không được để trống trường email"));
        }
        if (!RegexUtils.checkData(email, RegexUtils.REGEX_EMAIL)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Email không đúng định dạng"));
        }
        // validate password
        if (DataUtils.isNullOrEmpty(password)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không được để trống trường mật khẩu"));
        }
        if (password.length() < 8) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Mật khẩu phải lớn hơn 8 ký tự"));
        }
        // kiểm tra cache
        if (cacheAccount.get(email) != null) {
            throw new AppException(ErrorCode.CONFLICT_DATA.withMessage("Tài khoản đang chờ xác thực. Vui lòng kiểm tra hòm thư"));
        }
        // kiểm tra sự tồn tại db
        Optional<Account> accountOptional = accountRepository.findByEmail(email);
        if (accountOptional.isPresent()) {
            throw new AppException(ErrorCode.CONFLICT_DATA.withMessage("Tài khoản đã tồn tại trên hệ thống"));
        }

    }

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
                            account, userAgent, secretKey, timeLiveAccessToken, timeLiveRefreshToken))
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
        account = cacheAccount.get(request.getUsername());
        if (account != null) {
            if (!this.checkPasswordAccount(request.getPassword(), account.getPassword())) {
                return null;
            } else {
                throw new AppException(ErrorCode.NO_ACCESS.withMessage("Tài khoản đang chờ xác thực. Vui lòng kiểm tra hòm thư"));
            }
        }
        List<Account> accounts = accountRepository.findAllByEmailOrPhoneNumber(request.getUsername(), request.getUsername());
        if (!accounts.isEmpty()) {
            account = accounts.getFirst();
            // kiểm tra mật khâu
            if (!this.checkPasswordAccount(request.getPassword(), account.getPassword())) {
                return null;
            }
        }
        return account;
    }

    boolean checkPasswordAccount(String passwordInput, String correctPassword) {
        return correctPassword.equals(passwordInput);
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
