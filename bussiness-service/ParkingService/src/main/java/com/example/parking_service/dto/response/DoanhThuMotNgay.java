package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoanhThuMotNgay {
    LocalDate ngay;
    Long doanhThu;

    public DoanhThuMotNgay(Date ngay, Long doanhThu) {
        this.ngay = ngay != null ? ngay.toLocalDate() : null;
        this.doanhThu = doanhThu;
    }
}
