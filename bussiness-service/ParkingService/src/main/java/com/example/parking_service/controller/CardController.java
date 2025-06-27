package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.RequestAdditionalCard;
import com.example.parking_service.service.CardService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/card")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CardController {
    CardService cardService;

    @PostMapping("request/additional")
    ApiResponse<Object> requestAdditional(@RequestBody @Valid RequestAdditionalCard request) {
        return cardService.requestAdditional(request);
    }

    @GetMapping("/approved")
    ApiResponse<Object> getListCardApproved(Pageable pageable) {
        return cardService.getListCardApproved(pageable);
    }

    @GetMapping("/approved")
    ApiResponse<Object> getHistoryRequestAdditional(Pageable pageable) {
        return cardService.getHistoryRequestAdditional(pageable);
    }
}
