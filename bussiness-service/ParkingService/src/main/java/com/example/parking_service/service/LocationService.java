package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.PartnerSearchLocation;
import org.springframework.data.domain.Pageable;

public interface LocationService {
    ApiResponse<Object> searchLocationByPartner(PartnerSearchLocation request, Pageable pageable);
}
