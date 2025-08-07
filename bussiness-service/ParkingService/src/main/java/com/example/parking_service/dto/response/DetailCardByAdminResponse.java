package com.example.parking_service.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DetailCardByAdminResponse {
    Long id;

    String numberCard;

    String accountId;

    String owner;

    Integer requestTimes;

    Integer issuedTimes;

    LocalDate issuedDate;

    LocalDateTime expireDate;

    Integer type;

    Integer status;

    LocalDateTime lockAt;

    String ticketLink;

    String requestCreateBy;

    String requestCreateName;

    String reasonRequest;

    String reasonReject;

    Long usedTimes;

    LocalDate requestDate;
}
