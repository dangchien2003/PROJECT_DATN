package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.AdminTransactionHistoryResponse;
import com.example.parking_service.dto.response.TransactionHistoryResponse;
import com.example.parking_service.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "paymentPersonName", ignore = true)
    TransactionHistoryResponse toCusTransactionHistoryResponse(Payment entity);

    AdminTransactionHistoryResponse toAdminTransactionHistoryResponse(Payment payment);
}
