package com.example.notify.controller.listener;

import com.example.common.dto.kafka.SendEmail;
import com.example.notify.dto.other.EmailContext;
import com.example.notify.service.SendEmailService;
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
public class EmailListener {
    SendEmailService sendEmailService;

    @KafkaListener(topics = "sendEmailChangeInfoSuccess", groupId = "my-group")
    public void listen(SendEmail payload) {
        log.info("run sendEmailChangeInfoSuccess: {}", payload);
        EmailContext emailContext = EmailContext.builder()
                .template("welcome")
                .subject("Chào mừng")
                .build();
        sendEmailService.sendEmail(payload, emailContext);
    }
}
