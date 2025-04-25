package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.dto.request.SearchTicket;
import org.springframework.data.domain.Pageable;

public interface TicketService {
    ApiResponse<Object> modifyTicket(ModifyTicketRequest request);

    ApiResponse<Object> partnerSearch(SearchTicket request, Pageable pageable);
}
