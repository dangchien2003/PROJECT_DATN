package com.example.parking_service.dto.request;

import com.example.common.dto.request.DataTrend;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminSearchLocation {
    String partnerName;
    DataTrend createdAt;
    DataTrend timeAppliedEdit;
    Integer urgentApprovalRequest;
    Integer tab;

    // trường hợp search địa điểm hoạt động
    String name;
    LocalTime openTime;
    LocalTime closeTime;
    Integer openHoliday;
    Long capacity;
}
