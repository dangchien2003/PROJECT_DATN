package com.example.parking_service.enums;

import java.util.List;

public class PriceCategory {
    public static final Integer TIME = 1;
    public static final Integer DAY = 2;
    public static final Integer WEEK = 3;
    public static final Integer MONTH = 4;
    public static final List<Integer> ALL_CATEGORY = List.of(TIME, DAY, WEEK, MONTH);
}
