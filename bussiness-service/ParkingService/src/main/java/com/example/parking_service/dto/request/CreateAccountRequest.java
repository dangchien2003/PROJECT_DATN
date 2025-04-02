package com.example.parking_service.dto.request;

import com.example.common.utils.RegexUtils;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateAccountRequest {
    String fullName;
    Integer gender;
    @NotBlank(message = "Vui lòng nhập email và thử lại")
    @Email(regexp = RegexUtils.REGEX_EMAIL, message = "Vui lòng nhập đúng email và thử lại")
    String email;
    String phoneNumber;
    String password;
    Integer category;
    PartnerRequest partner;
    Integer status;
}
