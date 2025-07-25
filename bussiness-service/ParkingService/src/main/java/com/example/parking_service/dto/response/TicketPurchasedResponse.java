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
public class TicketPurchasedResponse {
    String id;
    Integer status;
    String ticketName;
    String createdBy;
    String createdName;
    LocalDateTime createdAt;
    Long price;
    String supplyId;
    String supplier;

    public TicketPurchasedResponse(String id, Integer status, String ticketName, String createdBy, LocalDateTime createdAt, Long price, String supplyId) {
        this.id = id;
        this.status = status;
        this.ticketName = ticketName;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.price = price;
        this.supplyId = supplyId;
    }
}
