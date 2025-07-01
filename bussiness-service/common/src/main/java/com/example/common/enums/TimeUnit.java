package com.example.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.temporal.ChronoUnit;

@Getter
@AllArgsConstructor
public enum TimeUnit {
    Y(ChronoUnit.YEARS),
    M(ChronoUnit.MONTHS),
    D(ChronoUnit.DAYS),
    H(ChronoUnit.HOURS),
    m(ChronoUnit.MINUTES),
    s(ChronoUnit.SECONDS),
    ;
    final ChronoUnit unit;
}
