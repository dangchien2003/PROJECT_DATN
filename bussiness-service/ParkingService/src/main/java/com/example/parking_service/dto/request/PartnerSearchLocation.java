package com.example.parking_service.dto.request;

import com.example.common.dto.request.DataTrend;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PartnerSearchLocation {
    String name;
    LocalTime openTime;
    LocalTime closeTime;
    Boolean openHoliday;
    Integer tab;
    // chờ duyệt
    DataTrend timeAppliedEdit;
    List<LocalDate> createdDate;
    Integer category;
    Boolean urgentApprovalRequest;
}
