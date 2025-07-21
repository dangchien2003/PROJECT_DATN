package com.example.parking_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ItemCountQuantityTicketUseInDay {
    String time;
    int quantity;
}
