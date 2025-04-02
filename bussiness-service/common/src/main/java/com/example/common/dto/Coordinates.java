package com.example.common.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Coordinates {
    Double x;
    Double y;
}
