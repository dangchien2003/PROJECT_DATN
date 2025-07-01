package com.example.parking_service.dto.request;

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
    @NotNull(message = "Toạ độ không được để trống")
    Double coordinatesX;
    @NotNull(message = "Toạ độ không được để trống")
    Double coordinatesY;
    String linkGoogleMap;
    String avatar;
    String videoTutorial;
    LocalTime openTime;
    LocalTime closeTime;
    LocalDateTime openDate;
    @NotNull(message = "Không tìm thấy dữ liệu mở cửa ngày lễ")
    Integer openHoliday;
    @NotNull(message = "Thời gian áp dụng chỉnh sửa không được để trống")
    LocalDateTime timeAppliedEdit;
    @NotNull(message = "Không tìm thấy dữ liệu yêu cầu duyệt khẩn cấp")
    Integer urgentApprovalRequest;
    String description;
    String infoLocation;
    Integer status;
}
