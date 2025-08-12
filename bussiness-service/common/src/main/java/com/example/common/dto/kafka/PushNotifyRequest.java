package com.example.common.dto.kafka;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PushNotifyRequest {
    String to;
    String title;
    String content;
    String link;
    int viewed;
    String actionBy;
}
