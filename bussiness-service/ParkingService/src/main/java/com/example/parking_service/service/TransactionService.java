package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.SearchHistoryTransactionRequest;
import org.springframework.data.domain.Pageable;

public interface TransactionService {

    ApiResponse<Object> getHistory(SearchHistoryTransactionRequest request, String paymentBy, Pageable pageable);

    ApiResponse<Object> partnergetHistory(SearchHistoryTransactionRequest request, Pageable pageable);
}
