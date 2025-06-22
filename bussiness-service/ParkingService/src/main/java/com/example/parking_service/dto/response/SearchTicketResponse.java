package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchTicketResponse {
    Long ticketId;
    String name;
    Integer vehicle;
    Long priceTimeSlot;
    Long priceDaySlot;
    Long priceWeekSlot;
    Long priceMonthSlot;
    Long countLocation;
}
