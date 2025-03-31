package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.PartnerRequest;

public interface PartnerService {
    ApiResponse<Object> createPartner(PartnerRequest request, String accountId);
}
