package com.example.notify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class NotifyApplication {
    public static String testPartnerActionBy = "641a00fd-9936-4a95-aa0c-d2fbc0fca9a3";
    public static String testAdminUUID = "admin";

    public static void main(String[] args) {
        SpringApplication.run(NotifyApplication.class, args);
    }

}
