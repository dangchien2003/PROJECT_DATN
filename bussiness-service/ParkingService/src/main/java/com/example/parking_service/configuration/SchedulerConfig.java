package com.example.parking_service.configuration;

import com.example.parking_service.service.LocationModifyService;
import com.example.parking_service.service.SchedulerService;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@EnableScheduling
@Slf4j
public class SchedulerConfig {
    LocationModifyService locationModifyService;
    SchedulerService schedulerService;

    @Scheduled(cron = "0 0 * * * *") // giây, phút, giờ, ngày, tháng, thứ
    public void runEveryHour() {
        locationModifyService.loadScheduler();
    }

    @Scheduled(cron = "0 */5 * * * *") // giây, phút, giờ, ngày, tháng, thứ
    public void runEveryFiveMinutes() {
        schedulerService.refresh();
    }

    @PostConstruct
    public void loadSchedulerLocation() {
        locationModifyService.loadScheduler();
    }
}
