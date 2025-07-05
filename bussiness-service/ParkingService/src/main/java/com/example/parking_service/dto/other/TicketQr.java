package com.example.parking_service.dto.other;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketQr {
    String ticketId;
    String accountId;
    LocalDateTime createdAt;
}
