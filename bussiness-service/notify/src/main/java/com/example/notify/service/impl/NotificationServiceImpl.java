package com.example.notify.service.impl;

import com.example.common.dto.request.SendNotifyRequest;
import com.example.common.dto.response.ApiResponse;
import com.example.notify.dto.response.NotificationResponse;
import com.example.notify.entity.Notification;
import com.example.notify.mapper.NotificationMapper;
import com.example.notify.repository.NotificationRepository;
import com.example.notify.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    NotificationRepository notificationRepository;
    NotificationMapper notificationMapper;
    // web socket
    SimpMessagingTemplate messagingTemplate;

    @Override
    public ApiResponse<Object> send(SendNotifyRequest request) {
        Notification notification = notificationMapper.toNotification(request);
        notification = notificationRepository.save(notification);
        NotificationResponse response = notificationMapper.toNotificationResponse(notification);
        this.sendToClient(response);
        return ApiResponse.builder()
                .result(response)
                .build();
    }

    @Override
    public void sendToClient(NotificationResponse response) {
        messagingTemplate.convertAndSendToUser(response.getTo(), "/queue/notify", response);
    }
}
