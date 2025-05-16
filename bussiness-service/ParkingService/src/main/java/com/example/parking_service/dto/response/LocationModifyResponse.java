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
public class LocationModifyResponse {

    Long modifyId;

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

    String reasonReject;

    LocalTime openTime;

    LocalTime closeTime;

    LocalDateTime openDate;

    Boolean openHoliday;

    LocalDateTime timeAppliedEdit;

    Boolean urgentApprovalRequest;

    Long capacity;

    String description;

    String infoLocation;

    String modifyDescription;

    Boolean isDel;

    LocalDateTime createdAt;
}
