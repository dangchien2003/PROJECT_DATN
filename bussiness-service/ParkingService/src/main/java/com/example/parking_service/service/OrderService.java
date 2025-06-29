package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ConfirmOrderRequest;
import com.example.parking_service.dto.request.CreateOrderRequest;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface OrderService {
    ApiResponse<Object> order(CreateOrderRequest request) throws JsonProcessingException;

    ApiResponse<Object> confirmOrder(ConfirmOrderRequest request);
}
