package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class ConfirmForgetRequest {
    @NotBlank()
    String id;
    @NotBlank()
    String otp;
}
