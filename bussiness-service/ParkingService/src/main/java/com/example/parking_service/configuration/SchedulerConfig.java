package com.example.parking_service.configuration;

import com.example.parking_service.service.LocationModifyService;
import com.example.parking_service.service.SchedulerService;
import com.example.parking_service.service.TicketService;
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
    TicketService ticketService;
    SchedulerService schedulerService;

    // quét địa điểm chờ áp dụng
    @Scheduled(cron = "0 0 * * * *") // giây, phút, giờ, ngày, tháng, thứ
    public void scanLocationWaitRelease() {
        locationModifyService.loadScheduler();
    }

    // quét địa điểm chờ áp dụng
    @Scheduled(cron = "0 */15 * * * *") // giây, phút, giờ, ngày, tháng, thứ
    public void scanTicketWaitRelease() {
        ticketService.loadScheduler();
    }

    // làm mới hàng đợi
    @Scheduled(cron = "0 */5 * * * *") // giây, phút, giờ, ngày, tháng, thứ
    public void runEveryFiveMinutes() {
        schedulerService.refresh();
    }

    @PostConstruct
    public void loadSchedulerLocation() {
        locationModifyService.loadScheduler();
        ticketService.loadScheduler();
    }
}
