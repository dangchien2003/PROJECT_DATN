package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.dto.request.SearchHistoryTransactionRequest;
import com.example.parking_service.service.TransactionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> customerGetHistory(@RequestBody SearchHistoryTransactionRequest request, Pageable pageable) {
        String accountId = UserContextHolder.getContext().getUid();
        return transactionService.getHistory(request, accountId, pageable);
    }

    @PostMapping("/admin/history")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> adminGetHistory(@RequestBody SearchHistoryTransactionRequest request, Pageable pageable) {
        return transactionService.getHistory(request, null, pageable);
    }

    @PostMapping("/partner/history")
    @PreAuthorize("hasAnyAuthority('PARTNER')")
    ApiResponse<Object> partnerGetHistory(@RequestBody SearchHistoryTransactionRequest request, Pageable pageable) {
        return transactionService.partnergetHistory(request, pageable);
    }
}
