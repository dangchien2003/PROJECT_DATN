package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExtendRequest {
    @NotBlank(message = "Vé không hợp lệ")
    String ticketId;
    @NotNull(message = "Hạn sử dụng không được để trống")
    LocalDateTime expires;
}
