package com.example.parking_service.mapper;

import com.example.parking_service.entity.Ticket;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TicketMapper {
//    void mapTicket(@MappingTarget Ticket ticket, ModifyTicketRequest request);

    //    Ticket toTicket(ModifyTicketRequest modifyTicketRequest);
    Ticket cloneTicket(Ticket ticket);
}
