package com.example.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.temporal.ChronoUnit;

@Getter
@AllArgsConstructor
public enum TimeUnit {
    Y(ChronoUnit.MINUTES),
    M(ChronoUnit.MINUTES),
    D(ChronoUnit.MINUTES),
    H(ChronoUnit.MINUTES),
    m(ChronoUnit.MINUTES),
    s(ChronoUnit.MINUTES),
    ;
    ChronoUnit unit;
}
