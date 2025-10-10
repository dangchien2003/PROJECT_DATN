package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.service.CheckingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/checking")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CheckingController {
    CheckingService checkingService;

    @PostMapping("checkin")
    ApiResponse<Object> checkinTicket(
            @RequestParam("file") MultipartFile file,
            @RequestParam("method") Integer method,
            @RequestParam("content") String content,
            @RequestParam("locationId") Long locationId
    ) {
        return checkingService.checkin(file, method, content, locationId);
    }

    @PostMapping("checkout")
    ApiResponse<Object> checkoutTicket(
            @RequestParam("file") MultipartFile file,
            @RequestParam("method") Integer method,
            @RequestParam("content") String content,
            @RequestParam("locationId") Long locationId
    ) {
        return checkingService.checkout(file, method, content, locationId);
    }

    @PostMapping("test")
    ApiResponse<Object> test(
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return checkingService.test(file);
    }
}
