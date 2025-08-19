package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StatisticalCardAtHomeByAdminResponse {
    List<ItemValueCard> doanhThu;
    List<ItemValueCard> veDaBan;
    List<ItemValueCard> soTienNap;
    List<ItemValueCard> taiKhoan;
    List<ItemValueCard> veDaTao;
    List<ItemValueCard> diemDo;
}
