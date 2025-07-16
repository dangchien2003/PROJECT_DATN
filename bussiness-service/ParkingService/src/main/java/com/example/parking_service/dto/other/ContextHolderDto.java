package com.example.parking_service.dto.other;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContextHolderDto {
    String uid;
    String userAgent;
    @JsonDeserialize(using = ScopeDeserializer.class)
    List<String> roles;
}