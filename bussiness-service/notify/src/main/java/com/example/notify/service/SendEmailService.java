package com.example.notify.service;

import com.example.common.dto.kafka.SendEmail;
import com.example.notify.dto.other.EmailContext;

public interface SendEmailService {
    void sendEmail(SendEmail dto, EmailContext context);
}
