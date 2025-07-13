package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ConfirmOrderRequest;
import com.example.parking_service.dto.request.CreateOrderRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;

import java.io.UnsupportedEncodingException;

public interface OrderService {
    ApiResponse<Object> order(CreateOrderRequest request) throws JsonProcessingException;

    ApiResponse<Object> confirmOrder(ConfirmOrderRequest request, HttpServletRequest httpServletRequest) throws UnsupportedEncodingException, JsonProcessingException;
}
