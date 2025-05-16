package com.example.parking_service.dto.response;

import java.time.LocalDateTime;

public interface AdminSearchLocationWaitApproveResponse {
    Long getModifyId();

    Long getLocationId();

    String getName();

    Integer getStatus();

    Integer getModifyStatus();

    LocalDateTime getCreatedAt();

    LocalDateTime getTimeAppliedEdit();

    String getPartnerFullName();
}
