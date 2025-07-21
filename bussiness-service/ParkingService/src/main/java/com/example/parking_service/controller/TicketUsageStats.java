package com.example.parking_service.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class TicketUsageStats {

    public static List<Map.Entry<String, Integer>> calculateUsagePer15Minutes(List<Ticket> tickets, LocalDate targetDate) {
        List<Map.Entry<String, Integer>> result = new ArrayList<>();

        LocalDateTime startOfDay = targetDate.atStartOfDay();
        for (int i = 0; i < 96; i++) { // 24 hours * 4 (15-min intervals)
            LocalDateTime intervalStart = startOfDay.plusMinutes(i * 15);

            int count = 0;
            for (Ticket ticket : tickets) {
                if (ticket.isValidAt(intervalStart)) {
                    count++;
                }
            }

            String timeStr = intervalStart.toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm"));
            result.add(Map.entry(timeStr, count));
        }

        return result;
    }

    // Demo
    public static void main(String[] args) {
        List<Ticket> tickets = Arrays.asList(
                new Ticket("2025-07-01 00:15:00.000000", "2025-08-03 00:00:00.000000"),
                new Ticket("2025-06-28 00:00:00.000000", "2025-07-01 20:00:00.000000")
        );

        LocalDate targetDate = LocalDate.of(2025, 7, 1);
        List<Map.Entry<String, Integer>> usageStats = calculateUsagePer15Minutes(tickets, targetDate);

        // Print results
        for (Map.Entry<String, Integer> entry : usageStats) {
            System.out.println("Thời gian sử dụng: " + entry.getKey() + ", Số lượng vé: " + entry.getValue());
        }
    }

    static class Ticket {
        LocalDateTime startsValidity;
        LocalDateTime expires;

        public Ticket(String start, String end) {
            this.startsValidity = LocalDateTime.parse(start, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS"));
            this.expires = LocalDateTime.parse(end, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS"));
        }

        public boolean isValidAt(LocalDateTime time) {
            return !time.isBefore(startsValidity) && time.isBefore(expires);
        }
    }
}