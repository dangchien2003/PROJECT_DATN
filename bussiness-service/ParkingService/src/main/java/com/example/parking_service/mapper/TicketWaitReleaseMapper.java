package com.example.parking_service.mapper;

import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.entity.Ticket;
import com.example.parking_service.entity.TicketWaitRelease;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TicketWaitReleaseMapper {
    @Mapping(target = "timeSlot", source = "timeSlot", qualifiedByName = "convertToInteger")
    @Mapping(target = "daySlot", source = "daySlot", qualifiedByName = "convertToInteger")
    @Mapping(target = "weekSlot", source = "weekSlot", qualifiedByName = "convertToInteger")
    @Mapping(target = "monthSlot", source = "monthSlot", qualifiedByName = "convertToInteger")
    TicketWaitRelease toTicketWaitRelease(ModifyTicketRequest request);

    void mapWithTicket(@MappingTarget TicketWaitRelease target, Ticket ticket);

    @Mapping(target = "timeSlot", source = "timeSlot", qualifiedByName = "convertToInteger")
    @Mapping(target = "daySlot", source = "daySlot", qualifiedByName = "convertToInteger")
    @Mapping(target = "weekSlot", source = "weekSlot", qualifiedByName = "convertToInteger")
    @Mapping(target = "monthSlot", source = "monthSlot", qualifiedByName = "convertToInteger")
    void mapWithModifyRequest(@MappingTarget TicketWaitRelease target, ModifyTicketRequest request);

    TicketWaitRelease toTicketWaitRelease(Ticket ticket);

    @Named("convertToInteger")
    default Integer convertToBoolean(Boolean data) {
        if (Boolean.TRUE.equals(data)) {
            return 1;
        } else {
            return 0;
        }
    }
}
