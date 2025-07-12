package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AddDepositRequest;
import com.example.parking_service.service.DepositService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/deposit")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Validated
public class DepositController {
    DepositService depositService;

    @PostMapping()
    ApiResponse<Object> addDeposit(@Valid @RequestBody AddDepositRequest request, HttpServletRequest http) throws UnsupportedEncodingException {
        return depositService.requestDeposit(request, http);
    }

    @GetMapping("history")
    ApiResponse<Object> getHistory(Pageable pageable) {
        return depositService.getHistory(pageable);
    }

    @DeleteMapping("cancel/{id}")
    ApiResponse<Object> cancelRequest(@PathVariable("id") Long id) {
        return depositService.cancelRequest(id);
    }
}
