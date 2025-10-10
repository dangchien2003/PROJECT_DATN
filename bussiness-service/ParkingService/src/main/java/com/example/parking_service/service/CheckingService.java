package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CheckingService {
    ApiResponse<Object> checkin(MultipartFile file, Integer method, String content, Long locationId);

    ApiResponse<Object> checkout(MultipartFile file, Integer method, String content, Long locationId);

    ApiResponse<Object> test(MultipartFile file) throws IOException;
}
