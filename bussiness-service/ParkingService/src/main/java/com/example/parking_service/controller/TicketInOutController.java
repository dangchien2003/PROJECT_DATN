package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.service.TicketInOutService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/checking")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class TicketInOutController {
    TicketInOutService ticketInOutService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getByAccount")
    ApiResponse<Object> historyByAccount(
            @RequestParam String accountId,
            Pageable pageable) {
        return ticketInOutService.historyByAccountId(accountId, pageable);
    }

    @GetMapping("/detail")
    ApiResponse<Object> detail(@RequestParam Long id) {
        return ticketInOutService.detail(id);
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @GetMapping("/getByTicket")
    ApiResponse<Object> historyByTicket(
            @RequestParam String ticketPurchasedId,
            Pageable pageable) {
        return ticketInOutService.historyByTicket(ticketPurchasedId, pageable);
    }

    @PreAuthorize("hasAuthority('PARTNER')")
    @GetMapping("/getByLocation")
    ApiResponse<Object> historyByLocation(
            @RequestParam Long locationId,
            Pageable pageable) {
        String partnerId = UserContextHolder.getContext().getUid();
        return ticketInOutService.historyByLocation(locationId, partnerId, pageable);
    }
}
