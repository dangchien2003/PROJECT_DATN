package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.CusTicketPurchasedDetailResponse;
import com.example.parking_service.dto.response.CusTicketPurchasedSearchResponse;
import com.example.parking_service.entity.TicketPurchased;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketPurchasedMapper {
    CusTicketPurchasedSearchResponse toCusTicketPurchasedSearchResponse(TicketPurchased entity);

    CusTicketPurchasedDetailResponse toCusTicketPurchasedDetailResponse(TicketPurchased entity);
}
