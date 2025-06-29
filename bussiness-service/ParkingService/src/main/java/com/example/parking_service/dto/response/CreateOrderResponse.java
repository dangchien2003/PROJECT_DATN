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
public class CreateOrderResponse {
    Long orderId;
    LocalDateTime createdAt;
    String personPaymentName;
    String email;
    LocalDateTime startTime;
    LocalDateTime expire;
    Integer qualityTicket;
    Long priceUnit;
    Long total;
}
