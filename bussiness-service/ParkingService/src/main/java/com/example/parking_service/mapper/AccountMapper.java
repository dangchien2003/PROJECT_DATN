package com.example.parking_service.mapper;

import com.example.parking_service.dto.request.CreateAccountRequest;
import com.example.parking_service.dto.response.AccountResponse;
import com.example.parking_service.dto.response.ClientInfoAccountResponse;
import com.example.parking_service.entity.Account;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    Account toAccount(CreateAccountRequest dto);

    List<AccountResponse> toListAccountResponses(List<Account> entityList);

    AccountResponse toAccountResponse(Account entity);

    ClientInfoAccountResponse toClientInfoAccountResponse(Account entity);
}
