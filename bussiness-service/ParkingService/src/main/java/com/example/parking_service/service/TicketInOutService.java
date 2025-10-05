package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import org.springframework.data.domain.Pageable;

public interface TicketInOutService {
    ApiResponse<Object> historyByAccountId(String accountId, Pageable pageable);

    ApiResponse<Object> historyByLocation(Long locationId, String partnerId, Pageable pageable);

    ApiResponse<Object> historyByTicket(String ticketPurchasedId, Pageable pageable);

    ApiResponse<Object> detail(Long id);
}
