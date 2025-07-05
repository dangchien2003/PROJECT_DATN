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
public class CusTicketPurchasedDetailResponse {
    String id;
    String ticketName;
    Integer status;
    String reason;
    String locationName;
    String locationAddress;
    LocalDateTime startsValidity;
    LocalDateTime expires;
    Long usedTimes;
    String contentPlate;
    Integer timeExtend;
    Integer timeUnitExtend;
    Long priceExtend;
    Integer createdQrCodeCount;
}
