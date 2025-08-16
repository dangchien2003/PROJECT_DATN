package com.example.parking_service.service.impl;

import com.example.common.dto.kafka.SendEmail;
import com.example.common.dto.response.ApiResponse;
import com.example.common.enums.TimeUnit;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.RandomUtils;
import com.example.common.utils.RegexUtils;
import com.example.common.utils.TimeUtil;
import com.example.parking_service.client.GoogleProfileClient;
import com.example.parking_service.client.GoogleTokenClient;
import com.example.parking_service.dto.other.DataForget;
import com.example.parking_service.dto.other.DataOtp;
import com.example.parking_service.dto.other.SubjectAccessToken;
import com.example.parking_service.dto.other.SubjectRefreshToken;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.dto.response.GoogleAccessTokenResponse;
import com.example.parking_service.dto.response.GoogleUserProfileResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.enums.*;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.service.AuthenticationService;
import com.example.parking_service.service.CacheService;
import com.example.parking_service.service.CryptoService;
import com.example.parking_service.service.NotifyService;
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
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    // tạm lưu cache tại đây
    AccountRepository accountRepository;
    GoogleTokenClient googleTokenClient;
    GoogleProfileClient googleProfileClient;
    UserUtils userUtils;
    ObjectMapper objectMapper;
    CryptoService cryptoService;
    CacheService cacheService;
    NotifyService notifyService;


    String redirectUriForRegister = "http://localhost:3000/register";
    String redirectUriForAuth = "http://localhost:3000/authen";

    @NonFinal
    @Value("${DOMAIN_FE}")
    String domainFE;

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
        String keyCache = "forgetAccount-" + request.getId();
        DataOtp dataOtp = cacheService.get(keyCache, DataOtp.class);
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
        cacheService.delete(keyCache);
        // gửi mail otp
        Map<String, Object> dataMail = new HashMap<>();
        dataMail.put("newPassword", newPassword);
        SendEmail sendEmail = SendEmail.builder()
                .to(account.getEmail())
                .data(dataMail)
                .build();
        notifyService.sendEmail(sendEmail, "sendNewPassword");
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
        ChronoUnit chronoUnit = TimeUnit.valueOf(timeUnitForget).getUnit();
        DataForget dataForget = DataForget.builder()
                .id(account.getId())
                .expire(LocalDateTime.now().plus(timeQualityForget, TimeUnit.valueOf(timeUnitForget).getUnit()))
                .category(category)
                .length(lengthOtpForget)
                .build();
        // cata cache
        String otp = RandomUtils.randomNumber(lengthOtpForget);
        DataOtp dataOtp = DataOtp.builder()
                .otp(otp)
                .ip(ip)
                .dataForget(dataForget)
                .build();
        // cache
        cacheService.putWithTTL("forgetAccount-" + account.getId(), dataOtp, timeQualityForget, TimeUtil.toTimeUnit(chronoUnit));
        // gửi mail otp
        Map<String, Object> dataMail = new HashMap<>();
        dataMail.put("email", account.getEmail());
        dataMail.put("otp", otp);
        dataMail.put("expires", timeQualityForget + " " + TimeUtil.toUnitNameVN(chronoUnit));
        SendEmail sendEmail = SendEmail.builder()
                .to(account.getEmail())
                .data(dataMail)
                .build();
        notifyService.sendEmail(sendEmail, "forgetAccount");
        return ApiResponse.builder()
                .result(dataForget)
                .build();
    }

    @Override
    public ApiResponse<Object> registrationAccount(RegistrationAccount request, String ip) {
        if (request.getType() == null) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        Account account = null;
        String email = null;
        if (request.getType().equals(AuthenType.USERNAME_PASSWORD)) {
            email = request.getEmail();
            String password = request.getPassword();
            validateRegisAccountForEP(email, password);
            account = Account.builder()
                    .email(email)
                    .password(password)
                    .category(AccountCategory.KHACH_HANG.getValue())
                    .status(AccountStatus.DANG_HOAT_DONG.getValue())
                    .balance(0L)
                    .build();
            DataUtils.setDataAction(account, ip, true);
            // cache
            long expire = 10;
            ChronoUnit unit = TimeUnit.m.getUnit();
            cacheService.putWithTTL("waitConfirm:" + account.getEmail(), account, expire, TimeUtil.toTimeUnit(unit));
            // mã hoá key
            String code = cryptoService.encrypt(account.getEmail());
            // gửi mail xác nhận
            Map<String, Object> dataMail = new HashMap<>();
            dataMail.put("email", account.getEmail());
            dataMail.put("confirmationUrl", domainFE + "/confirm-regis?code=" + code);
            dataMail.put("expires", expire + " " + TimeUtil.toUnitNameVN(unit));
            SendEmail sendEmail = SendEmail.builder()
                    .to(account.getEmail())
                    .data(dataMail)
                    .template("confirmCreateAccount")
                    .subject("Xác nhận đăng ký tài khoản")
                    .build();
            notifyService.sendEmail(sendEmail, "common");
        } else if (request.getType().equals(AuthenType.GOOGLE)) {
            System.out.println("tạo tk bằng google");
            // gửi mail
            Map<String, Object> dataMail = new HashMap<>();
            dataMail.put("email", account.getEmail());
            SendEmail sendEmail = SendEmail.builder()
                    .to(account.getEmail())
                    .data(dataMail)
                    .template("welcome")
                    .subject("Chào mừng bạn đến với Parking")
                    .build();
            notifyService.sendEmail(sendEmail, "common");
        } else {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        return ApiResponse.builder()
                .result(email)
                .build();
    }

    @Override
    public ApiResponse<Object> confirmRegis(String code, String ip) {
        String email;
        try {
            email = cryptoService.decrypt(code);
        } catch (AppException e) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Mã xác nhận không hợp lệ"));
        }
        Account account = cacheService.get("waitConfirm:" + email, Account.class);
        if (account == null) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Yêu cầu đã hết hạn xử lý. Vui lòng thực hiện tạo lại từ đầu"));
        }
        DataUtils.setDataAction(account, ip, false);
        accountRepository.save(account);
        cacheService.delete("waitConfirm:" + email);
        Map<String, Object> dataMail = new HashMap<>();
        dataMail.put("email", account.getEmail());
        SendEmail sendEmail = SendEmail.builder()
                .to(account.getEmail())
                .data(dataMail)
                .template("welcome")
                .subject("Chào mừng bạn đến với Parking")
                .build();
        notifyService.sendEmail(sendEmail, "common");
        return ApiResponse.builder()
                .result(account.getEmail())
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
        if (cacheService.get("waitConfirm:" + email, Account.class) != null) {
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

    @Override
    public ApiResponse<Object> refreshToken(RefreshTokenRequest request, String userAgent) {
        try {
            // lỗi khi không call từ trình duyệt
            if (checkUserAgent && !userUtils.isValidUserAgent(userAgent)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            // valid dữ liệu
            if (DataUtils.isNullOrEmpty(request.getAccess()) || DataUtils.isNullOrEmpty(request.getRefresh())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            // giải mã refresh
            SignedJWT signedJWTRefresh = this.verifyToken(request.getRefresh());
            SubjectRefreshToken subjectRefreshToken = objectMapper.readValue(
                    signedJWTRefresh.getJWTClaimsSet().getSubject(), SubjectRefreshToken.class);
            // giải mã access
            SignedJWT signedJWTAccess = SignedJWT.parse(request.getAccess());
            SubjectAccessToken subjectAccessToken = objectMapper.readValue(
                    signedJWTAccess.getJWTClaimsSet().getSubject(), SubjectAccessToken.class);
            // kiểm tra userAgent
            if (!userAgent.equals(subjectRefreshToken.getUserAgent())
                    || !subjectRefreshToken.getUserAgent().equals(subjectAccessToken.getUserAgent())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            // kiểm tra đúng access
            String accessCrypto = cryptoService.decrypt(subjectRefreshToken.getAccess());
            if (!accessCrypto.equals(request.getAccess())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            Account account = accountRepository.findById(subjectAccessToken.getUid())
                    .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
            return this.verifyAccount(account, userAgent);
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    public SignedJWT verifyToken(String token)
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
        if (checkUserAgent && !userUtils.isValidUserAgent(userAgent)) {
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

        return this.verifyAccount(account, userAgent);
    }

    ApiResponse<Object> verifyAccount(Account account, String userAgent) {
        // kiểm tra trạng thái
        if (account.getStatus().equals(AccountStatus.KHOA_TAM_THOI.getValue())
                || account.getStatus().equals(AccountStatus.KHOA_TAI_KHOAN.getValue())) {
            throw new AppException(ErrorCode.NO_ACCESS.withMessage("Tài khoản đã bị khoá, vui lòng liên hệ hỗ trợ để giải quyết"));
        }
        // trả kết quả
        try {
            return ApiResponse.builder()
                    .result(userUtils.createAuthenticationResponse(
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
        account = cacheService.get("waitConfirm:" + request.getUsername(), Account.class);
        if (account != null) {
            if (!this.checkPasswordAccount(request.getPassword(), account.getPassword())) {
                // trả về null và thông báo tk mật khẩu không chính xác
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
                // trả về null và thông báo tk mật khẩu không chính xác
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
