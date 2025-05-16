package com.example.common.utils;

import java.time.LocalDateTime;

public class TimeUtil {
    public static LocalDateTime getStartOfCurrentHour() {
        return LocalDateTime.now()
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
    }

    public static LocalDateTime getStartOfCurrentHour(LocalDateTime localDateTime) {
        return localDateTime
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
    }

    public static LocalDateTime getStartOfNextHour() {
        LocalDateTime now = LocalDateTime.now();
        return now.plusHours(1).withMinute(0).withSecond(0).withNano(0);
    }

    public static LocalDateTime getStartOfNextHour(LocalDateTime localDateTime) {
        return localDateTime.plusHours(1).withMinute(0).withSecond(0).withNano(0);
    }
}
