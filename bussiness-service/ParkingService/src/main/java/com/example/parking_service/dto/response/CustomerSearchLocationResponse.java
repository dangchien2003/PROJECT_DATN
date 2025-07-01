package com.example.parking_service.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CustomerSearchLocationResponse {
    Long locationId;

    String partnerId;

    String partnerName;

    String name;

    String address;

    Double coordinatesX;

    Double coordinatesY;

    String linkGoogleMap;

    String avatar;

    LocalTime openTime;

    LocalTime closeTime;

    Boolean openHoliday;

    Long capacity;

    Long used;
}
