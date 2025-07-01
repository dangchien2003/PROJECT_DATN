package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.RequestAdditionalCard;
import org.springframework.data.domain.Pageable;

public interface CardService {
    ApiResponse<Object> requestAdditional(RequestAdditionalCard request);

    ApiResponse<Object> getListCardApproved(Pageable pageable);

    ApiResponse<Object> getHistoryRequestAdditional(Pageable pageable);
}
