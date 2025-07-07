package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.CusTransactionHistoryResponse;
import com.example.parking_service.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    CusTransactionHistoryResponse toCusTransactionHistoryResponse(Payment entity);
}
