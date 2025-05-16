package com.example.notify.controller.rest;

import com.example.common.dto.request.SendNotifyRequest;
import com.example.common.dto.response.ApiResponse;
import com.example.notify.service.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("get/all")
    ApiResponse<Object> getAllNotify(@RequestParam("page") int page) {
        return notificationService.getAllNotify(page);
    }

    @PutMapping("view/all")
    ApiResponse<Object> viewAll() {
        return notificationService.viewAll();
    }

    @GetMapping("count/viewed-not-yet")
    ApiResponse<Object> countViewedNotYet() {
        return notificationService.countViewedNotYet();
    }
}
