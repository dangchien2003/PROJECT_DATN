package com.example.parking_service.client;

import com.example.parking_service.dto.request.GoogleAccessTokenRequest;
import com.example.parking_service.dto.response.GoogleAccessTokenResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "google-auth-token", url = "https://oauth2.googleapis.com")
public interface GoogleTokenClient {
    @PostMapping(value = "/token", produces = MediaType.APPLICATION_JSON_VALUE)
    GoogleAccessTokenResponse getAccessToken(@RequestBody GoogleAccessTokenRequest request);
}
