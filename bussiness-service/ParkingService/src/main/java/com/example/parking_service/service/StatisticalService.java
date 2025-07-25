package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import org.springframework.data.domain.Pageable;

public interface StatisticalService {
    ApiResponse<Object> getTicketOfCustomer(String accountId, Pageable pageable);

    ApiResponse<Object> getTransactionOfCustomer(String accountId, Pageable pageable);

    ApiResponse<Object> getTicketOfPartner(String partnerId, Pageable pageable);

    ApiResponse<Object> getTicketPurchasedOfPartner(String partnerId, Pageable pageable);
}
