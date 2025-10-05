package com.example.parking_service.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionHistoryResponse {
    String paymentId;

    Integer type;

    Integer fluctuation;

    Long total;

    Integer paymentMethod;

    Integer status;

    String content;

    LocalDateTime createdAt;

    String paymentBy;

    String paymentPersonName;
}
