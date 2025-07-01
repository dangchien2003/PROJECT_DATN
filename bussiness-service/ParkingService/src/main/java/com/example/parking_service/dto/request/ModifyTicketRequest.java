package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ModifyTicketRequest {
    Long ticketId;
    @NotBlank(message = "Tên vé không được để trống")
    String name;
    @NotBlank(message = "Mô tả vé không được để trống")
    String description;
    @NotNull(message = "Thời gian áp dụng không được để trống")
    LocalDateTime timeAppliedEdit;
    @NotNull(message = "Phương tiện không được để trống")
    Integer vehicle;
    Long priceTimeSlot;
    Long priceDaySlot;
    Long priceWeekSlot;
    Long priceMonthSlot;
    List<Long> locationUse;
}
