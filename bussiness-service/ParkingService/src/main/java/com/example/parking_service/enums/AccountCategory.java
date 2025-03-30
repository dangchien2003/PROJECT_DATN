package com.example.parking_service.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AccountCategory {
    ADMIN(0),
    DOI_TAC(1),
    KHACH_HANG(2),
    ;
    Integer value;
}
