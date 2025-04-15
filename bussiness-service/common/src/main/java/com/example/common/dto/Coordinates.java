package com.example.common.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Coordinates {
    @NotNull(message = "Không tìm thấy kinh độ địa điểm")
    Double x;
    @NotNull(message = "Không tìm thấy vĩ độ địa điểm")
    Double y;
}
