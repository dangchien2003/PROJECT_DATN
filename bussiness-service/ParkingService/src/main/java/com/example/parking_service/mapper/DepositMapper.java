package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.DepositHistoryResponse;
import com.example.parking_service.entity.Deposit;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepositMapper {
    DepositHistoryResponse toDepositHistoryResponse(Deposit entity);
}
