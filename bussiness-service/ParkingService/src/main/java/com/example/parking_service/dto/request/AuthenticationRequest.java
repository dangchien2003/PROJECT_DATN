package com.example.parking_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    // authen
    String username;
    String password;

    // google
    String authorizationCode;
    String codeVerifier;

    Integer type;
}
