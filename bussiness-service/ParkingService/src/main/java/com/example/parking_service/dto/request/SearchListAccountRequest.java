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
public class SearchListAccountRequest {
    String fullName;
    String email;
    String phoneNumber;
    Integer gender;
    Integer status;
    DataTrend balance;
    // search đối tác
    String partnerFullName;
    String partnerEmail;
    String partnerPhoneNumber;
}
