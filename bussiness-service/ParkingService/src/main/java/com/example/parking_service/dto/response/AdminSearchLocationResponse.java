package com.example.parking_service.dto.response;

import java.time.LocalDateTime;

public interface AdminSearchLocationResponse {
    Long getLocationId();

    String getName();

    Double getCoordinatesX();

    Double getCoordinatesY();

    String getLinkGoogleMap();

    Integer getStatus();

    Integer getModifyStatus();

    LocalDateTime getOpenDate();

    Long getCapacity();
}
