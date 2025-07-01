package com.example.parking_service.dto.other;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class DataForget {
    String id;
    LocalDateTime expire;
    Integer category;
    Integer length;
}
