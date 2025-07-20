package com.example.parking_service.utils;

import com.example.common.utils.RegexUtils;
import com.example.parking_service.dto.other.SubjectAccessToken;
import com.example.parking_service.dto.other.SubjectRefreshToken;
import com.example.parking_service.dto.response.AuthenticationResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.enums.AccountCategory;
import com.example.parking_service.service.CryptoService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Component
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserUtils {
    ObjectMapper objectMapper;
    CryptoService cryptoService;

    public String genAccessToken(Account account, int timeLive,
                                 String secretKey, String userAgent) throws JOSEException, JsonProcessingException {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(objectMapper.writeValueAsString(new SubjectAccessToken(account.getId(), userAgent, buildScope(account))))
                .issuer("parking")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(timeLive, ChronoUnit.MINUTES).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(account))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        jwsObject.sign(new MACSigner(secretKey.getBytes()));

        return jwsObject.serialize();
    }

    String buildScope(Account account) {
        if (account.getCategory().equals(AccountCategory.ADMIN.getValue())) {
            return "ADMIN";
        } else if (account.getCategory().equals(AccountCategory.DOI_TAC.getValue())) {
            return "PARTNER";
        } else {
            return "CUSTOMER";
        }
    }

    String genRefreshToken(String access, String userAgent, int timeLive, String secretKey) throws JOSEException, JsonProcessingException {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        String accessCrypto = cryptoService.encrypt(access);
        SubjectRefreshToken subjectRefreshToken = SubjectRefreshToken.builder()
                .userAgent(userAgent)
                .access(accessCrypto)
                .build();

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(objectMapper.writeValueAsString(subjectRefreshToken))
                .issuer("book_store")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(timeLive, ChronoUnit.MINUTES).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);


        jwsObject.sign(new MACSigner(secretKey.getBytes()));
        return jwsObject.serialize();
    }

    public AuthenticationResponse createAuthenticationResponse(
            Account account, String userAgent, String secretKey, int timeLiveAccessToken,
            int timeLiveRefreshToken) throws JOSEException, JsonProcessingException {
        String access = this.genAccessToken(account, timeLiveAccessToken, secretKey, userAgent);
        String refresh = this.genRefreshToken(access, userAgent, timeLiveRefreshToken, secretKey);
        return AuthenticationResponse.builder()
                .id(account.getId())
                .fullName(account.getFullName())
                .partnerFullName(account.getPartnerFullName())
                .accessToken(access)
                .refreshToken(refresh)
                .expire(timeLiveAccessToken * 60)
                .actor(buildScope(account).toLowerCase())
                .build();
    }

    public boolean isValidUserAgent(String userAgent) {
        if (userAgent == null || userAgent.trim().isEmpty()) {
            return false;
        }
        return RegexUtils.checkData(userAgent, RegexUtils.USER_AGENT_REGEX);
    }
}
