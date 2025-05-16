package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ApproveRequest;
import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface LocationModifyService {
    ApiResponse<Object> modifyLocation(ModifyLocationRequest request, String actionBy) throws JsonProcessingException;

    ApiResponse<Object> deleteModify(Long modifyId);

    ApiResponse<Object> approve(ApproveRequest request);

    ApiResponse<Object> detailModify(Long id);

    void loadScheduler();
}
