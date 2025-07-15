package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu không được để trống")
    String oldPassword;
    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Length(min = 8, max = 20, message = "Mật khẩu phải có độ dài 8 đến 20 ký tự")
    String newPassword;
}
