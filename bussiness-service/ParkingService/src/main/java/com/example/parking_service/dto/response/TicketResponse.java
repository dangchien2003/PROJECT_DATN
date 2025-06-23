package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TicketResponse {
    Long ticketId;
    String partnerId;
    Integer modifyCount;
    String name;
    Integer status;
    Integer modifyStatus;
    String reason;
    LocalDateTime releasedTime;
    Integer vehicle;
    Long priceTimeSlot;
    Long priceDaySlot;
    Long priceWeekSlot;
    Long priceMonthSlot;
    String description;
    List<Long> locationUse;
    LocalDateTime createdAt;
}
