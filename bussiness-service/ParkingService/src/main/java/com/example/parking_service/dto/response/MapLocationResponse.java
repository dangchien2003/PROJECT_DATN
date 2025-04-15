package com.example.parking_service.dto.response;

import com.example.common.dto.Coordinates;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MapLocationResponse {
    Long locationId;
    String partnerId;
    String partnerFullName;
    String name;
    String address;
    Coordinates coordinates;
    String linkGoogleMap;
    LocalTime openTime;
    LocalTime closeTime;
    LocalDateTime openDate;
}
