package com.example.notify;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class test3 {
    private final test producer;

    @GetMapping("/send")
    public String send(@RequestParam String msg) {
        producer.sendMessage(msg);
        return "Sent: " + msg;
    }
}
