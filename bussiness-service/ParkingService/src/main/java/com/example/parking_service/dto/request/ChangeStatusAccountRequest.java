package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.hibernate.validator.constraints.Length;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangeStatusAccountRequest {
    @NotBlank(message = "Tài khoản không xác định")
    String accountId;
    @NotNull(message = "Trạng thái không xác định")
    Integer status;
    @NotBlank(message = "Lý do không được để trống")
    @Length(max = 255, message = "Lý do không được quá 255 ký tự")
    String reason;
}
