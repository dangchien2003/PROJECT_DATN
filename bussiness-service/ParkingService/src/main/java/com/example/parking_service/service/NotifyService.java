package com.example.parking_service.service;

import com.example.common.dto.kafka.PushNotifyRequest;
import com.example.common.dto.kafka.SendEmail;

public interface NotifyService {
    void sendEmail(SendEmail data, String topic);

    void pushNotify(PushNotifyRequest data);
}
