package com.example.notify.service;

import com.example.common.dto.request.SendNotifyRequest;
import com.example.common.dto.response.ApiResponse;
import com.example.notify.dto.response.NotificationResponse;

public interface NotificationService {
    ApiResponse<Object> send(SendNotifyRequest request);

    ApiResponse<Object> getAllNotify(int page);

    ApiResponse<Object> countViewedNotYet();

    ApiResponse<Object> viewAll();

    void viewed(Long id, String userId);

    void sendToClient(NotificationResponse response);
}
