package com.example.parking_service.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public enum AccountCategory {
    ADMIN(0),
    DOI_TAC(1),
    KHACH_HANG(2),
    ;
    Integer value;
}
