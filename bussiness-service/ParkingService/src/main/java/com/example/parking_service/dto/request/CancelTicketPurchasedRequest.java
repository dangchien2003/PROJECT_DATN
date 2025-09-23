package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CancelTicketPurchasedRequest {
    @NotBlank(message = "Không tìm thấy mã vé")
    String id;
    @NotBlank(message = "Lý do không được để trống")
    String reason;
}
