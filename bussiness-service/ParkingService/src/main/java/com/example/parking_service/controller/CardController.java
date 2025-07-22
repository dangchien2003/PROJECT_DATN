package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.service.CardService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/card")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CardController {
    CardService cardService;

    @PostMapping("request/additional")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> requestAdditional(@RequestBody @Valid RequestAdditionalCard request) {
        return cardService.requestAdditional(request);
    }

    @GetMapping("/approved")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> getListCardApproved(Pageable pageable) {
        return cardService.getListCardApproved(pageable);
    }

    @GetMapping("/history/request")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> getHistoryRequestAdditional(Pageable pageable) {
        return cardService.getHistoryRequestAdditional(pageable);
    }

    @PutMapping("/active")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> active(@Valid @RequestBody ActiveCardRequest request) {
        return cardService.active(request);
    }

    @PostMapping("/admin/search")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> adminSearch(@RequestBody SearchCardByAdminRequest request, Pageable pageable) {
        return cardService.adminSearch(request, pageable);
    }

    @PostMapping("/admin/search/add")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> adminSearchRequest(@RequestBody SearchCardAddByAdminRequest request, Pageable pageable) {
        return cardService.adminSearchRequest(request, pageable);
    }

    @PatchMapping("/reject-request")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> rejectRequest(@Valid @RequestBody RejectRequestAddCard request) {
        return cardService.rejectRequest(request);
    }

    @PatchMapping("/approve-request/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> approveRequest(@PathVariable("id") Long id) {
        return cardService.approveRequest(id);
    }
}
