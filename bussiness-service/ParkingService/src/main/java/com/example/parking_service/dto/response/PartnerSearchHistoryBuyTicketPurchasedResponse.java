package com.example.parking_service.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PartnerSearchHistoryBuyTicketPurchasedResponse {
    String id;
    String personBuy;
    String owner;
    Integer status;
    LocalDateTime startsValidity;
    LocalDateTime expires;
    Long usedTimes;
}
