package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StatisticalTicketWaitReleaseOfPartner {
    Long id;
    Long ticketId;
    String name;
    Integer modifyCount;
    Integer status;
    LocalDateTime releaseAt;
    Integer vehicle;
    Integer countLocationUse;
}
