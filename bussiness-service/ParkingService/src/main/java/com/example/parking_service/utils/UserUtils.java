package com.example.parking_service.utils;

import com.example.parking_service.dto.other.SubjectAccessToken;
import com.example.parking_service.dto.response.AuthenticationResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.enums.AccountCategory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

public class UserUtils {

    private static final String USER_AGENT_REGEX =
            ".*(Mozilla|Chrome|Safari|Firefox|Opera|Edge|Trident).*(Windows|Macintosh|Linux|Android|iPhone).*";

    public static String genAccessToken(Account account, int timeLive, String secretKey, String userAgent,
                                        ObjectMapper objectMapper) throws JOSEException, JsonProcessingException {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(objectMapper.writeValueAsString(new SubjectAccessToken(account.getId(), userAgent)))
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

    public static String buildScope(Account account) {
        if (account.getCategory().equals(AccountCategory.ADMIN.getValue())) {
            return "ADMIN";
        } else if (account.getCategory().equals(AccountCategory.DOI_TAC.getValue())) {
            return "PARTNER";
        } else {
            return "CUSTOMER";
        }
    }

    public static String genRefreshToken(String userAgent, int timeLive, String secretKey) throws JOSEException {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(userAgent)
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

    public static AuthenticationResponse createAuthenticationResponse(
            Account account, String userAgent, String secretKey, int timeLiveAccessToken,
            int timeLiveRefreshToken, ObjectMapper objectMapper) throws JOSEException, JsonProcessingException {
        return AuthenticationResponse.builder()
                .id(account.getId())
                .fullName(account.getFullName())
                .partnerFullName(account.getPartnerFullName())
                .accessToken(genAccessToken(account, timeLiveAccessToken, secretKey, userAgent, objectMapper))
                .refreshToken(genRefreshToken(userAgent, timeLiveRefreshToken, secretKey))
                .expire(timeLiveAccessToken * 60)
                .actor(buildScope(account).toLowerCase())
                .build();
    }

    public static boolean isValidUserAgent(String userAgent) {
        if (userAgent == null || userAgent.trim().isEmpty()) {
            return false;
        }

        return userAgent.matches(USER_AGENT_REGEX);
    }
}
