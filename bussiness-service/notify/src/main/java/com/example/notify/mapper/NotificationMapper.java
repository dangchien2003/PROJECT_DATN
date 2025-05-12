package com.example.notify.mapper;

import com.example.common.dto.request.SendNotifyRequest;
import com.example.notify.dto.response.NotificationResponse;
import com.example.notify.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(target = "accountId", source = "to")
    Notification toNotification(SendNotifyRequest request);

    @Mapping(target = "to", source = "accountId")
    NotificationResponse toNotificationResponse(Notification entity);
}
