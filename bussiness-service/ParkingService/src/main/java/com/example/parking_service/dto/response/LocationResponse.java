package com.example.parking_service.dto.response;


import com.example.common.dto.Coordinates;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationResponse {

    Long id;

    String partnerId;

    String name;

    Integer modifyCount;

    Coordinates coordinates;

    String linkGoogleMap;

    String avatar;

    String videoTutorial;

    Integer status;

    Integer modifyStatus;

    String reason;

    LocalTime openTime;

    LocalTime closeTime;

    Date openDate;

    Boolean openHoliday;

    Long capacity;

    String description;

    String infoLocation;

    LocalDateTime createdAt;
}
