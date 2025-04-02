package com.example.parking_service.dto.request;

import com.example.common.dto.Coordinates;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ModifyLocationRequest {
    Long locationId;
    @NotBlank(message = "Tên địa điểm không được để trống")
    String name;
    @NotBlank(message = "Địa chỉ không được để trống")
    String address;
    Coordinates coordinates;
    String linkGoogleMap;
    String avatar;
    String videoTutorial;
    LocalTime openTime;
    LocalTime closeTime;
    @NotNull
    Integer openHoliday;
    @NotNull
    LocalDateTime timeAppliedEdit;
    @NotNull
    Integer urgentApprovalRequest;
    String description;
    String infoLocation;
    Integer status;
}
