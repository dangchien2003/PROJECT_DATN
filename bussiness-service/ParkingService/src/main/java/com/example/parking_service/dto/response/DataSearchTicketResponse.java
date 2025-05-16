package com.example.parking_service.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataSearchTicketResponse {

    Long id;

    Integer released;

    LocalDateTime releaseAt;

    Long ticketId;

    String partnerId;

    String partnerName;

    Integer modifyCount;

    String name;

    Integer status;

    Integer modifyStatus;

    String reason;

    LocalDateTime releasedTime;

    String rejectBy;

    String reasonReject;

    Integer vehicle;

    boolean timeSlot;

    boolean daySlot;

    boolean weekSlot;

    boolean monthSlot;

    Boolean isDel;

    String description;

    LocalDateTime timeAppliedEdit;

    PriceResponse price;
    List<Long> locationUse;
}
