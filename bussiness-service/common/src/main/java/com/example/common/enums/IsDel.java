package com.example.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum IsDel {
    DELETE_NOT_YET(0),
    DELETED(1),
    ;
    Integer value;
}
