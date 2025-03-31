package com.example.parking_service.mapper;

import com.example.parking_service.dto.request.PartnerRequest;
import com.example.parking_service.entity.Partner;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PartnerMapper {
    Partner toPartner(PartnerRequest dto);
}
