package com.example.notify.controller.web_socket;

import com.example.notify.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/notify")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class NotifySocketController {
    NotificationService notificationService;

    @MessageMapping("notify/viewed")
    public void broadcastMessage(@Header("user-id") String userId, @Payload Long id) {
        notificationService.viewed(id, userId);
    }

}
