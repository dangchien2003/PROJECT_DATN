package com.example.parking_service.enums;

import java.util.List;

public class PaymentMethod {
    public static Integer SO_DU = 0;
    public static Integer VNPAY = 1;
    public static Integer BANKING = 2;

    public static List<Integer> ALL_METHOD = List.of(SO_DU, VNPAY, BANKING);
}
