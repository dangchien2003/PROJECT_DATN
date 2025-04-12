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
public class LocationWaitReleaseResponse {
    Long id;

    Long modifyId;

    Long locationId;

    Boolean released;

    LocalDateTime releaseAt;

    LocalDateTime timeAppliedEdit;

    Boolean isDel;

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

    String reason;

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
