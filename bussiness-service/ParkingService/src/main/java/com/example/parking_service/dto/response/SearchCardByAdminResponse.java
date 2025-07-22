package com.example.parking_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchCardByAdminResponse {
    Long id;
    String numberCard;
    LocalDate issuedDate;
    Integer status;
    Integer type;
    String requestName;
    LocalDate requestDate;
    String ownerName;
}
