package com.example.parking_service.mapper;

import com.example.parking_service.dto.request.CreateAccountRequest;
import com.example.parking_service.dto.response.SearchListCustomerResponse;
import com.example.parking_service.entity.Account;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    Account toAccount(CreateAccountRequest dto);

    List<SearchListCustomerResponse> toSearchListCustomerResponse(List<Account> entityList);

    SearchListCustomerResponse toSearchListCustomerResponse(Account entity);
}
