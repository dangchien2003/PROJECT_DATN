package com.example.parking_service.dto.request;

import com.example.common.dto.request.DataTrend;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

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
}
