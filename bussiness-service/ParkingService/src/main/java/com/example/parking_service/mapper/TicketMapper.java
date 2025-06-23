package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.CustomerTicketResponse;
import com.example.parking_service.dto.response.DataSearchTicketResponse;
import com.example.parking_service.dto.response.SearchTicketResponse;
import com.example.parking_service.dto.response.TicketLocationResponse;
import com.example.parking_service.entity.Ticket;
import com.example.parking_service.entity.TicketLocation;
import com.example.parking_service.entity.TicketWaitRelease;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TicketMapper {
//    void mapTicket(@MappingTarget Ticket ticket, ModifyTicketRequest request);

    //    Ticket toTicket(ModifyTicketRequest modifyTicketRequest);


    @Mapping(target = "isDel", ignore = true)
    DataSearchTicketResponse toDataSearchTicketResponse(Ticket ticket);

    @Mapping(target = "isDel", source = "isDel", qualifiedByName = "convertToBoolean")
    DataSearchTicketResponse toDataSearchTicketResponse(TicketWaitRelease ticketWaitRelease);


//    TicketPriceResponse toTicketPriceResponse(TicketPrice entity);

    TicketLocationResponse toTicketLocationResponse(TicketLocation entity);

    SearchTicketResponse toSearchTicketResponse(Ticket ticket);

    CustomerTicketResponse toCustomerTicketResponse(Ticket ticket);

    @Named("convertToBoolean")
    default Boolean convertToBoolean(Integer data) {
        return data.equals(1);
    }

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    void toTicketFromReleaseEntity(@MappingTarget Ticket location, TicketWaitRelease releaseEntity);

}
