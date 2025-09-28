package com.example.parking_service.dto.response;

import java.time.LocalDate;


public interface DoanhThuMotNgayProjection {

    LocalDate getNgay();

    Long getDoanhThu();
}
