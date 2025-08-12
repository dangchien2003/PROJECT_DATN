package com.example.notify.service.impl;

import com.example.common.dto.kafka.SendEmail;
import com.example.notify.dto.other.EmailContext;
import com.example.notify.service.HtmlContentBuilderService;
import com.example.notify.service.SendEmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class SendEmailServiceImpl implements SendEmailService {
    HtmlContentBuilderService htmlContentBuilderService;
    JavaMailSender mailSender;

    @Override
    public void sendEmail(SendEmail dto, EmailContext context) {
        try {
            String htmlContent = htmlContentBuilderService.buildHtml(context.getTemplate(), dto.getData());
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(dto.getTo());
            helper.setSubject(context.getSubject());
            helper.setFrom(context.getFrom(), context.getPersonal());
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("send email error: ", e);
        }
    }
}
