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
public class StatisticalLocationOfPartner {
    Long modifyId;
    Long locationId;
    String name;
    Double coordinatesX;
    Double coordinatesY;
    Integer status;
    Integer modifyStatus;
    Long capacity;
    Integer modifyCount;
    LocalDateTime modifiedAt;
    String linkGoogleMap;
    LocalDateTime timeAppliedEdit;
}
