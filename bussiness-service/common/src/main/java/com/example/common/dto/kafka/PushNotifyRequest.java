package com.example.common.dto.kafka;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PushNotifyRequest {
    String to;
    List<String> toMany;
    String title;
    String content;
    String link;
    int viewed;
    String actionBy;
}
