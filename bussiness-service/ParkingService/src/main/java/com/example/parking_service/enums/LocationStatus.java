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
    DA_DUYET_DANG_HOAT_DONG(1),
    TAM_DUNG_HOAT_DONG(3),
    NGUNG_HOAT_DONG(4),
    TU_CHOI_PHE_DUYET(5),
    ;
    Integer value;
}
