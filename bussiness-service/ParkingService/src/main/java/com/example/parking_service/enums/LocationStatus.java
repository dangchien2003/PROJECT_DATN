package com.example.parking_service.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PACKAGE)
public enum LocationStatus {
    CHO_DUYET(0),
    DA_DUYET(1),
    DANG_HOAT_DONG(2),
    TAM_DUNG_HOAT_DONG(3),
    KHONG_HOAT_DONG(4),
    TU_CHOI_PHE_DUYET(5),
    ;
    Integer value;
}
