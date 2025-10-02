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
public class DetailTicketInOutResponse {
    Long id;
    String locationName;
    String position;
    LocalDateTime checkinAt;
    Integer checkinMethod;
    String imagePlateIn;
    LocalDateTime checkoutAt;
    Integer checkoutMethod;
    String imagePlateOut;
    String numberCard;
}
