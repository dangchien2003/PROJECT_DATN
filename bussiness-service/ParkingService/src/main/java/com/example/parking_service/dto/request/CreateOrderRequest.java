package com.example.parking_service.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    String extendTicketId;
    List<String> helpBuy;
    Long locationId;
    Long ticketId;
    Integer ticketCategory;
    Integer quality;
    LocalDateTime startTime;
}
