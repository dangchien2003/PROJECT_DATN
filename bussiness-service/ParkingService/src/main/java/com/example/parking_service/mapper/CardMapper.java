package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.CardResponse;
import com.example.parking_service.dto.response.HistoryRequestAddCardResponse;
import com.example.parking_service.entity.Card;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CardMapper {
    CardResponse toCardResponse(Card card);

    HistoryRequestAddCardResponse toHistoryRequestAddCardResponse(Card card);
}
