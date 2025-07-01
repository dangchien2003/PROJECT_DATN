package com.example.parking_service.dto.other;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class DataOtp {
    String otp;
    String ip;
    DataForget dataForget;
}
