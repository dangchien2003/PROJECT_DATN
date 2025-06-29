package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ConfirmOrderRequest;
import com.example.parking_service.dto.request.CreateOrderRequest;
import com.example.parking_service.service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("order")
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;

    @PostMapping()
    ApiResponse<Object> order(@RequestBody CreateOrderRequest request) throws JsonProcessingException {
        return orderService.order(request);
    }

    @PostMapping("confirm")
    ApiResponse<Object> confirmOrder(@Valid @RequestBody ConfirmOrderRequest request) {
        return orderService.confirmOrder(request);
    }
}
