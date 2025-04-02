package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface LocationModifyService {
    ApiResponse<Object> modifyLocation(ModifyLocationRequest request, String actionBy) throws JsonProcessingException;
}
