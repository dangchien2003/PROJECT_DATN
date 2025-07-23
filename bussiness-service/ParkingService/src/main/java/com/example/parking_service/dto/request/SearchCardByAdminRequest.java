package com.example.parking_service.dto.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchCardByAdminRequest {
    String emailOwner;
    List<LocalDate> issuedDate;
    String numberCard;
    Integer status;
    Integer type;
    String requestName;
}
