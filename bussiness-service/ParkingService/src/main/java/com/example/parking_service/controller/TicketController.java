package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ApproveRequest;
import com.example.parking_service.dto.request.CustomerSearchTicket;
import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.dto.request.SearchTicket;
import com.example.parking_service.service.TicketService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ticket")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class TicketController {
    TicketService ticketService;

    @PostMapping("modify")
    ApiResponse<Object> modify(@Valid @RequestBody ModifyTicketRequest request) {
        return ticketService.modifyTicket(request);
    }

    @PostMapping("partner/search")
    ApiResponse<Object> partnerSearch(@RequestBody SearchTicket request, Pageable pageable) {
        return ticketService.partnerSearch(request, pageable);
    }

    @PostMapping("admin/search")
    ApiResponse<Object> adminSearch(@RequestBody SearchTicket request, Pageable pageable) {
        return ticketService.adminSearch(request, pageable);
    }

    @PostMapping("search")
    ApiResponse<Object> search(@RequestBody CustomerSearchTicket request, Pageable pageable) {
        return ticketService.search(request, pageable);
    }

    @GetMapping("detail")
    ApiResponse<Object> detail(@RequestParam("id") Long id) {
        return ticketService.detail(id);
    }

    @GetMapping("detail/wait-release")
    ApiResponse<Object> detailWaitRelease(@RequestParam("id") Long id) {
        return ticketService.detailWaitRelease(id);
    }

    @PostMapping("partner/cancel/wait-release")
    ApiResponse<Object> partnerCancelWaitRelease(@Valid @RequestBody ApproveRequest approveRequest) {
        return ticketService.cancelWaitRelease(approveRequest, false);
    }

    @PostMapping("admin/cancel/wait-release")
    ApiResponse<Object> adminCancelWaitRelease(@Valid @RequestBody ApproveRequest approveRequest) {
        return ticketService.cancelWaitRelease(approveRequest, true);
    }

    @GetMapping("check-exist-wait-release")
    ApiResponse<Object> checkExistWaitRelease(@RequestParam(name = "ticketId", required = true) Long ticketId) {
        ticketService.checkExistWaitRelease(ticketId);
        return ApiResponse.builder().build();
    }
}
