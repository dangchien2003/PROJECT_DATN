package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ticketResponse {
    Long ticketId;
    String partnerId;
    Integer modifyCount;
    String name;
    Integer status;
    Integer modifyStatus;
    String reason;
    LocalDateTime releasedTime;
    Integer vehicle;
    Integer timeSlot;
    Integer daySlot;
    Integer weekSlot;
    Integer monthSlot;
    String description;
    List<Long> locationUse;
    LocalDateTime createdAt;
}
