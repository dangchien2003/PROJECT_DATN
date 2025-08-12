package com.example.notify.dto.other;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailContext {
    String template;
    String subject;
    @Builder.Default
    String from = "from";
    @Builder.Default
    String personal = "Parking";
}
