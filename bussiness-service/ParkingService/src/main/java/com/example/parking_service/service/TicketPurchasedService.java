package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.CustomerSearchTicketPurchasedRequest;
import org.springframework.data.domain.Pageable;


public interface TicketPurchasedService {
    ApiResponse<Object> customerSearch(CustomerSearchTicketPurchasedRequest request, Pageable pageable);

    ApiResponse<Object> getQr(String id);

    ApiResponse<Object> refreshQr(String id);

    ApiResponse<Object> detail(String id);

    ApiResponse<Object> disableTicket(String id);

    ApiResponse<Object> enableTicket(String id);
}
