package com.example.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Release {
    RELEASE_NOT_YET(0),
    RELEASE(1),
    ;
    Integer value;
}
