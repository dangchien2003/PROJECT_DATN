package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.dto.request.SearchTicket;
import com.example.parking_service.service.TicketService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/partner/search")
    ApiResponse<Object> partnerSearch(@RequestBody SearchTicket request, Pageable pageable) {
        return ticketService.partnerSearch(request, pageable);
    }
}
