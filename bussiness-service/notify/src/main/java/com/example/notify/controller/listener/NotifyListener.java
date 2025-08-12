package com.example.notify.controller.listener;

import com.example.common.dto.kafka.PushNotifyRequest;
import com.example.notify.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class NotifyListener {
    NotificationService notificationService;

    @KafkaListener(topics = "pushNotify", groupId = "my-group")
    public void listen(PushNotifyRequest payload) {
        log.info("run pushNotify: {}", payload);
        notificationService.send(payload);
    }
}
