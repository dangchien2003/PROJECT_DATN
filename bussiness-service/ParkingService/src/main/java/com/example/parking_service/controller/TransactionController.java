package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.CusSearchHistoryTransactionRequest;
import com.example.parking_service.service.TransactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transaction")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class TransactionController {
    TransactionService transactionService;

    @PostMapping("/history")
        // role customer
    ApiResponse<Object> customerGetHistory(@RequestBody CusSearchHistoryTransactionRequest request, Pageable pageable) {
        return transactionService.customerGetHistory(request, pageable);
    }
}
