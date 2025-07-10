package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.TicketInOutResponse;
import com.example.parking_service.entity.TicketInOut;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketInOutMapper {
    TicketInOutResponse toTicketInOutResponse(TicketInOut entity);
}
