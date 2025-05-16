package com.example.parking_service.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public enum LocationModifyStatus {
    CHO_DUYET(0),
    TU_CHOI_PHE_DUYET(1),
    DA_DUYET_CHO_AP_DUNG(2),
    DA_AP_DUNG(3),
    ;
    Integer value;
}
