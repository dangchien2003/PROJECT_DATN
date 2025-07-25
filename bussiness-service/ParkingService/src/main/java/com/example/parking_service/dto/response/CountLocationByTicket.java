package com.example.parking_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CountLocationByTicket {
    Long ticketId;
    Long quantity;
}
