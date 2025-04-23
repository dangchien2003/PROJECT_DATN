package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ModifyTicketRequest;

public interface TicketService {
    ApiResponse<Object> modifyTicket(ModifyTicketRequest request);
}
