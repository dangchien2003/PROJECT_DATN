package com.example.parking_service.dto.response;


import com.example.common.dto.Coordinates;
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
public class LocationResponse {

    Long locationId;

    String partnerId;

    String name;

    String address;

    Integer modifyCount;

    Coordinates coordinates;

    String linkGoogleMap;

    String avatar;

    String videoTutorial;

    Integer status;

    Integer modifyStatus;

    String reasonChangeStatus;

    LocalTime openTime;

    LocalTime closeTime;

    LocalDateTime openDate;

    Boolean openHoliday;

    Long capacity;

    String approveBy;

    String description;

    String infoLocation;

    LocalDateTime createdAt;
}
