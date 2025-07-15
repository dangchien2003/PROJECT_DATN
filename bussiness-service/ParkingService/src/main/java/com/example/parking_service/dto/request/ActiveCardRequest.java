package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ActiveCardRequest {
    @NotNull(message = "Thẻ không xác định")
    Long id;
    @NotNull(message = "Mã kích hoạt không được để trống")
    String code;
}
