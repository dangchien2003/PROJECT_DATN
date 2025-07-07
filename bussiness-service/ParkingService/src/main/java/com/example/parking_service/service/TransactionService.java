package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.CusSearchHistoryTransactionRequest;
import org.springframework.data.domain.Pageable;

public interface TransactionService {
    ApiResponse<Object> customerGetHistory(CusSearchHistoryTransactionRequest request, Pageable pageable);
}
