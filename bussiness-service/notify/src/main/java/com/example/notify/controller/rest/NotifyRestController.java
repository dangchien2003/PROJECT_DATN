package com.example.notify.controller.rest;

import com.example.common.dto.request.SendNotifyRequest;
import com.example.common.dto.response.ApiResponse;
import com.example.notify.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notify")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class NotifyRestController {
    NotificationService notificationService;

    // nhận thông báo
    @PostMapping("send")
    ApiResponse<Object> send(@RequestBody SendNotifyRequest request) {
        return notificationService.send(request);
    }
}
