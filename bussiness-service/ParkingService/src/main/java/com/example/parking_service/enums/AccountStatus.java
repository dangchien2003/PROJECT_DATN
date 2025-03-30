package com.example.parking_service.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PACKAGE)
public enum AccountStatus {
    KHOA_TAI_KHOAN(0),
    KHOA_TAM_THOI(1),
    DANG_HOAT_DONG(2),
    ;
    Integer value;
}
