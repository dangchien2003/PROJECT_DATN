package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.service.StatisticalService;
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
@RequestMapping("/statistical")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class StatisticalController {
    StatisticalService statisticalService;

    @GetMapping("/ticket-of-customer")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getTicketOfCustomer(@RequestParam("accountId") String accountId, Pageable pageable) {
        return statisticalService.getTicketOfCustomer(accountId, pageable);
    }

    @GetMapping("/transaction-of-customer")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getTransactionOfCustomer(@RequestParam("accountId") String accountId, Pageable pageable) {
        return statisticalService.getTransactionOfCustomer(accountId, pageable);
    }

    @GetMapping("/ticket-of-partner")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getTicketOfPartner(@RequestParam("partnerId") String partnerId, Pageable pageable) {
        return statisticalService.getTicketOfPartner(partnerId, pageable);
    }

    @GetMapping("/ticket-wait-approve-of-partner")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getTicketWaitApproveOfPartner(@RequestParam("partnerId") String partnerId, Pageable pageable) {
        return statisticalService.getTicketWaitReleaseOfPartner(partnerId, pageable);
    }

    @GetMapping("/ticket-purchased-of-partner")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getTicketPurchasedOfPartner(@RequestParam("partnerId") String partnerId, Pageable pageable) {
        return statisticalService.getTicketPurchasedOfPartner(partnerId, pageable);
    }

    @GetMapping("/location-of-partner")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getLocationOfPartner(@RequestParam("partnerId") String partnerId, Pageable pageable) {
        return statisticalService.getLocationOfPartner(partnerId, pageable);
    }

    @GetMapping("/location-wait-release-of-partner")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getLocationWaitReleaseOfPartner(@RequestParam("partnerId") String partnerId, Pageable pageable) {
        return statisticalService.getLocationWaitReleaseOfPartner(partnerId, pageable);
    }
}
