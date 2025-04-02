package com.example.parking_service.mapper;

import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.example.parking_service.entity.LocationModify;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LocationModifyMapper {
    @Mapping(target = "coordinates", ignore = true)
    LocationModify toLocationModify(ModifyLocationRequest dto);
}
