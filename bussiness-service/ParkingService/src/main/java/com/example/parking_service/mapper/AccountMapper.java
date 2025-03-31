package com.example.parking_service.mapper;

import com.example.parking_service.dto.request.AccountRequest;
import com.example.parking_service.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    Account toAccount(AccountRequest dto);
}
