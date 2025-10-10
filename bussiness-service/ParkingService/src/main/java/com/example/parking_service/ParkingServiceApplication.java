package com.example.parking_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableFeignClients
@EnableAsync
@SpringBootApplication(scanBasePackages = {"com.example"})
public class ParkingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ParkingServiceApplication.class, args);
    }

}
