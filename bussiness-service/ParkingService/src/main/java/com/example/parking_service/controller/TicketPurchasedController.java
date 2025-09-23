package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.dto.request.CancelTicketPurchasedRequest;
import com.example.parking_service.dto.request.CustomerSearchTicketPurchasedRequest;
import com.example.parking_service.dto.request.PartnerSearchHistoryBuyTicketPurchasedRequest;
import com.example.parking_service.service.TicketPurchasedService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/purchased")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class TicketPurchasedController {
    TicketPurchasedService ticketPurchasedService;

    @PostMapping("customer/search")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> customerSearch(@RequestBody CustomerSearchTicketPurchasedRequest request, Pageable pageable) {
        return ticketPurchasedService.customerSearch(request, pageable);
    }

    @GetMapping("get-qr")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> getQr(@RequestParam("id") String id) {
        return ticketPurchasedService.getQr(id);
    }

    @PatchMapping("new-qr")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> refreshQr(@RequestParam("id") String id) {
        return ticketPurchasedService.refreshQr(id);
    }

    @GetMapping("detail")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> detail(@RequestParam("id") String id) {
        return ticketPurchasedService.detail(id);
    }

    @PatchMapping("disable")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> disableTicket(@RequestParam("id") String id) {
        return ticketPurchasedService.disableTicket(id);
    }

    @PatchMapping("enable")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> enableTicket(@RequestParam("id") String id) {
        return ticketPurchasedService.enableTicket(id);
    }

    @GetMapping("history/{id}")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> history(@PathVariable("id") String id, Pageable pageable) {
        return ticketPurchasedService.history(id, pageable);
    }

    @PostMapping("history-buy-ticket")
    @PreAuthorize("hasAnyAuthority('PARTNER', 'ADMIN')")
    ApiResponse<Object> historyBuyTicket(@RequestBody PartnerSearchHistoryBuyTicketPurchasedRequest request, Pageable pageable) {
        String partnerId = null;
        if (UserContextHolder.getContext().getRoles().contains("PARTNER")) {
            partnerId = UserContextHolder.getContext().getUid();
        }
        return ticketPurchasedService.historyBuyTicket(request, partnerId, pageable);
    }

    @PostMapping("cancel")
    @PreAuthorize("hasAnyAuthority('PARTNER', 'ADMIN')")
    ApiResponse<Object> cancelTicket(@Valid @RequestBody CancelTicketPurchasedRequest request) {
        String partnerId = null;
        if (UserContextHolder.getContext().getRoles().contains("PARTNER")) {
            partnerId = UserContextHolder.getContext().getUid();
        }
        return ticketPurchasedService.cancelTicket(request, partnerId);
    }

    @GetMapping("admin/detail")
    @PreAuthorize("hasAnyAuthority('PARTNER', 'ADMIN')")
    ApiResponse<Object> adminDetail(@RequestParam("id") String id) {
        String partnerId = null;
        if (UserContextHolder.getContext().getRoles().contains("PARTNER")) {
            partnerId = UserContextHolder.getContext().getUid();
        }
        return ticketPurchasedService.adminDetail(id, partnerId);
    }

    @GetMapping("admin/history/{id}")
    @PreAuthorize("hasAnyAuthority('PARTNER', 'ADMIN')")
    ApiResponse<Object> adminHistory(@PathVariable("id") String id, Pageable pageable) {
        String partnerId = null;
        if (UserContextHolder.getContext().getRoles().contains("PARTNER")) {
            partnerId = UserContextHolder.getContext().getUid();
        }
        return ticketPurchasedService.adminHistory(id, partnerId, pageable);
    }
}
