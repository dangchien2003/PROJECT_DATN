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
    public void sendEmailChangeInfoSuccess(SendEmail payload) {
        log.info("run sendEmailChangeInfoSuccess: {}", payload);
        EmailContext emailContext = EmailContext.builder()
                .template("welcome")
                .subject("Chào mừng")
                .build();
        sendEmailService.sendEmail(payload, emailContext);
    }

    @KafkaListener(topics = "forgetAccount", groupId = "my-group")
    public void forgetAccount(SendEmail payload) {
        log.info("run forgetAccount: {}", payload);
        EmailContext emailContext = EmailContext.builder()
                .template("forgetPassword")
                .subject("Quên mật khẩu")
                .build();
        sendEmailService.sendEmail(payload, emailContext);
    }

    @KafkaListener(topics = "sendNewPassword", groupId = "my-group")
    public void sendNewPassword(SendEmail payload) {
        log.info("run sendNewPassword: {}", payload);
        EmailContext emailContext = EmailContext.builder()
                .template("newPassword")
                .subject("Cấp lại mật khẩu đăng nhập")
                .build();
        sendEmailService.sendEmail(payload, emailContext);
    }

    @KafkaListener(topics = "changePassword", groupId = "my-group")
    public void changePassword(SendEmail payload) {
        log.info("run sendNewPassword: {}", payload);
        EmailContext emailContext = EmailContext.builder()
                .template("notifyChangePassword")
                .subject("Thông báo thay đổi mật khẩu")
                .build();
        sendEmailService.sendEmail(payload, emailContext);
    }

    @KafkaListener(topics = "common", groupId = "my-group")
    public void common(SendEmail payload) {
        log.info("run common: {}", payload);
        EmailContext emailContext = EmailContext.builder()
                .template(payload.getTemplate())
                .subject(payload.getSubject())
                .build();
        sendEmailService.sendEmail(payload, emailContext);
    }
}
