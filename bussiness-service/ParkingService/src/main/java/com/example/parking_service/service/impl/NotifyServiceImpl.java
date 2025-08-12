package com.example.parking_service.service.impl;

import com.example.common.dto.kafka.PushNotifyRequest;
import com.example.common.dto.kafka.SendEmail;
import com.example.parking_service.service.NotifyService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class NotifyServiceImpl implements NotifyService {
    KafkaTemplate<String, SendEmail> kafkaSendEmail;
    KafkaTemplate<String, PushNotifyRequest> kafkaPushNotify;

    @Override
    public void sendEmail(SendEmail data, String topic) {
        kafkaSendEmail.send(topic, data);
    }

    @Override
    public void pushNotify(PushNotifyRequest data) {
        kafkaPushNotify.send("pushNotify", data);
    }
}
