package com.example.notify.service.impl;

import com.example.common.dto.request.SendNotifyRequest;
import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.common.enums.View;
import com.example.common.utils.DataUtils;
import com.example.notify.NotifyApplication;
import com.example.notify.dto.response.NotificationResponse;
import com.example.notify.entity.Notification;
import com.example.notify.mapper.NotificationMapper;
import com.example.notify.repository.NotificationRepository;
import com.example.notify.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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
    public void viewed(Long id, String userId) {
        if (DataUtils.isNullOrEmpty(id) || DataUtils.isNullOrEmpty(userId)) {
            return;
        }
        notificationRepository.readNotify(View.VIEWED, id, LocalDateTime.now(), userId);
    }

    @Override
    public ApiResponse<Object> viewAll() {
        String id = NotifyApplication.testPartnerActionBy;
        notificationRepository.readAllNotify(View.VIEWED, id, LocalDateTime.now(), id);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> countViewedNotYet() {
        String id = NotifyApplication.testPartnerActionBy;
        long count = notificationRepository.countAllByViewedAndAccountId(View.VIEW_NOT_YET, id);
        return ApiResponse.builder()
                .result(count)
                .build();
    }

    @Override
    public ApiResponse<Object> send(SendNotifyRequest request) {
        Notification notification = notificationMapper.toNotification(request);
        DataUtils.setDataAction(notification, request.getActionBy(), true);
        notification = notificationRepository.save(notification);
        NotificationResponse response = notificationMapper.toNotificationResponse(notification);
        this.sendToClient(response);
        return ApiResponse.builder()
                .result(response)
                .build();
    }

    @Override
    public ApiResponse<Object> getAllNotify(int page) {
        String id = NotifyApplication.testPartnerActionBy;
        Pageable pageable = PageRequest.of(page, 10, Sort.by(BaseEntity_.CREATED_AT).descending());
        Page<Notification> notificationPage = notificationRepository.findAllByAccountId(id, pageable);
        List<NotificationResponse> data = notificationPage.stream()
                .map(notificationMapper::toNotificationResponse).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(data, notificationPage.getTotalPages(), notificationPage.getTotalElements()))
                .build();
    }

    @Override
    public void sendToClient(NotificationResponse response) {
        messagingTemplate.convertAndSendToUser(response.getTo(), "/queue/notify", response);
    }
}
