package com.example.parking_service.dto.request;

import jakarta.validation.constraints.Min;
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
public class AddDepositRequest {
    @NotNull(message = "Không được để trống số tiền nạp")
    @Min(value = 10000, message = "Số tiền nạp dưới mức tối thiểu. Vui lòng tăng số tiền")
    Long total;
    @NotNull(message = "Phương thức thanh toán không hợp lệ")
    Integer paymentMethod;
}
