package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConfirmOrderRequest {
    @NotNull(message = "Không tìm thấy mã đơn")
    Long orderId;
    @NotNull(message = "Không tìm thấy phương thức thanh toán")
    Integer paymentMethod;
}
