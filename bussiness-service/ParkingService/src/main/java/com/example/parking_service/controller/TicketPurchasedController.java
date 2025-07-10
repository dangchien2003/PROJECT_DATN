package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.CustomerSearchTicketPurchasedRequest;
import com.example.parking_service.service.TicketPurchasedService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/purchased")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class TicketPurchasedController {
    TicketPurchasedService ticketPurchasedService;

    @PostMapping("customer/search")
    ApiResponse<Object> customerSearch(@RequestBody CustomerSearchTicketPurchasedRequest request, Pageable pageable) {
        return ticketPurchasedService.customerSearch(request, pageable);
    }

    @GetMapping("get-qr")
    ApiResponse<Object> getQr(@RequestParam("id") String id) {
        return ticketPurchasedService.getQr(id);
    }

    @PatchMapping("new-qr")
    ApiResponse<Object> refreshQr(@RequestParam("id") String id) {
        return ticketPurchasedService.refreshQr(id);
    }

    @GetMapping("detail")
    ApiResponse<Object> detail(@RequestParam("id") String id) {
        return ticketPurchasedService.detail(id);
    }

    @PatchMapping("disable")
    ApiResponse<Object> disableTicket(@RequestParam("id") String id) {
        return ticketPurchasedService.disableTicket(id);
    }

    @PatchMapping("enable")
    ApiResponse<Object> enableTicket(@RequestParam("id") String id) {
        return ticketPurchasedService.enableTicket(id);
    }

    @GetMapping("history/{id}")
    ApiResponse<Object> history(@PathVariable("id") String id, Pageable pageable) {
        return ticketPurchasedService.history(id, pageable);
    }


}
