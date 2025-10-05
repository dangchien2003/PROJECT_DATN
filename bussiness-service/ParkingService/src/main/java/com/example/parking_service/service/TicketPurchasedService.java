package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.entity.OrderParking;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

import java.io.UnsupportedEncodingException;


public interface TicketPurchasedService {
    ApiResponse<Object> customerSearch(CustomerSearchTicketPurchasedRequest request, Pageable pageable);

    ApiResponse<Object> getQr(String id);

    ApiResponse<Object> refreshQr(String id);

    ApiResponse<Object> detail(String id);

    ApiResponse<Object> disableTicket(String id);

    ApiResponse<Object> enableTicket(String id);

    ApiResponse<Object> history(String id, Pageable pageable);

    ApiResponse<Object> historyBuyTicket(
            PartnerSearchHistoryBuyTicketPurchasedRequest request, String partnerId, Pageable pageable);

    void cancelTicketExpired();

    void processBuyTicketSuccess(OrderParking order) throws JsonProcessingException;

    ApiResponse<Object> cancelTicket(CancelTicketPurchasedRequest request, String partnerId);

    ApiResponse<Object> adminDetail(String id, String partnerId);

    ApiResponse<Object> adminHistory(String id, String partnerId, Pageable pageable);

    ApiResponse<Object> extend(ExtendRequest request);

    ApiResponse<Object> confirmExtend(ConfirmOrderRequest request, HttpServletRequest http) throws UnsupportedEncodingException;

    void processExtendTicketSuccess(String ticketPurchasedId, Long total, String actionBy);
}
