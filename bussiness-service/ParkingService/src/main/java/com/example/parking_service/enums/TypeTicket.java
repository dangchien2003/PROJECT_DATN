package com.example.parking_service.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public enum TypeTicket {
    CHO_AP_DUNG(1),
    PHAT_HANH(2),
    ;
    Integer value;
}
