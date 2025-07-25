package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StatisticalTicketPurchasedOfPartner {
    Long ticketId;
    String ticketName;
    Integer ticketCategory;
    Long locationId;
    String locationName;
    Integer ticketQuantity;
    Long total;
    Integer vehicle;
    LocalDateTime buyAt;
    LocalDateTime start;
    LocalDateTime expire;

    public StatisticalTicketPurchasedOfPartner(Long ticketId, String ticketName, Integer ticketCategory, Long locationId, Integer ticketQuantity, Long total, Integer vehicle, LocalDateTime buyAt, LocalDateTime start, LocalDateTime expire) {
        this.ticketId = ticketId;
        this.ticketName = ticketName;
        this.ticketCategory = ticketCategory;
        this.locationId = locationId;
        this.ticketQuantity = ticketQuantity;
        this.total = total;
        this.vehicle = vehicle;
        this.buyAt = buyAt;
        this.start = start;
        this.expire = expire;
    }
}
