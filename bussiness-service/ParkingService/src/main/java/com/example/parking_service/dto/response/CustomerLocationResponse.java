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
public class CustomerLocationResponse {

    Long locationId;

    String name;

    String address;

    Double coordinatesX;

    Double coordinatesY;

    String linkGoogleMap;

    String avatar;

    String videoTutorial;

    LocalTime openTime;

    LocalTime closeTime;

    Boolean openHoliday;

    Long capacity;

    Long used;

    String description;
}
