package com.example.common.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.TimeUnit;

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

    public static String formatLocalDateTime(LocalDateTime localDateTime, String format) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        return localDateTime.format(formatter);
    }

    public static TimeUnit toTimeUnit(ChronoUnit chronoUnit) {
        switch (chronoUnit) {
            case NANOS:
                return TimeUnit.NANOSECONDS;
            case MICROS:
                return TimeUnit.MICROSECONDS;
            case MILLIS:
                return TimeUnit.MILLISECONDS;
            case SECONDS:
                return TimeUnit.SECONDS;
            case MINUTES:
                return TimeUnit.MINUTES;
            case HOURS:
                return TimeUnit.HOURS;
            case DAYS:
                return TimeUnit.DAYS;
            default:
                throw new IllegalArgumentException("Unsupported ChronoUnit: " + chronoUnit);
        }
    }

    public static String toUnitNameVN(ChronoUnit chronoUnit) {
        switch (chronoUnit) {
            case NANOS:
                return "nano giây";
            case MICROS:
                return "micro giây";
            case MILLIS:
                return "mili giây";
            case SECONDS:
                return "giây";
            case MINUTES:
                return "phút";
            case HOURS:
                return "giờ";
            case DAYS:
                return "ngày";
            default:
                throw new IllegalArgumentException("Unsupported ChronoUnit: " + chronoUnit);
        }
    }
}
