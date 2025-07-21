package com.example.parking_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TimeUseTicketPurchased {
    LocalDateTime startsValidity;
    LocalDateTime expires;

    public boolean isValidAt(LocalDateTime time) {
        // thời gian đang đếm  sau hoặc bằng thời điểm bắt đầu và thời điểm đang đếm ở trước thời điểm hết hạn
        return !time.isBefore(startsValidity) && time.isBefore(expires);
    }
}
