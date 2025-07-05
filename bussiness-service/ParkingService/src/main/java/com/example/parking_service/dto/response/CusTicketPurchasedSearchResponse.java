package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CusTicketPurchasedSearchResponse {
    String id;
    String ticketName;
    LocalDateTime createdAt;
    Integer status;
    LocalDateTime startsValidity;
    LocalDateTime expires;
}
