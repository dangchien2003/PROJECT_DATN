package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MapLocationResponse {
    Long locationId;
    String partnerId;
    String partnerFullName;
    String name;
    String address;
    Double coordinatesX;
    Double coordinatesY;
    String linkGoogleMap;
    LocalTime openTime;
    LocalTime closeTime;
    LocalDateTime openDate;
}
