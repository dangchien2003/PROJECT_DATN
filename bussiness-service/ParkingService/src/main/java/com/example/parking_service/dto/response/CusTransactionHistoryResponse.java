package com.example.parking_service.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CusTransactionHistoryResponse {
    String paymentId;

    Integer type;

    Integer fluctuation;

    Long total;

    Integer status;

    String content;

    LocalDateTime createdAt;
}
