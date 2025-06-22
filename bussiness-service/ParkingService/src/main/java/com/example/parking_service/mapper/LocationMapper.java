package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.CustomerLocationResponse;
import com.example.parking_service.dto.response.CustomerSearchLocationResponse;
import com.example.parking_service.dto.response.LocationResponse;
import com.example.parking_service.dto.response.MapLocationResponse;
import com.example.parking_service.entity.Location;
import com.example.parking_service.entity.LocationWaitRelease;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    @Mapping(target = "openHoliday", source = "openHoliday", qualifiedByName = "convertToBoolean")
    LocationResponse toLocationResponse(Location entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    void toLocationFromReleaseEntity(@MappingTarget Location location, LocationWaitRelease releaseEntity);

    MapLocationResponse toMapLocationResponse(Location location);

    @Mapping(target = "openHoliday", source = "openHoliday", qualifiedByName = "convertToBoolean")
    CustomerSearchLocationResponse toCustomerSearchLocationResponse(Location entity);

    @Mapping(target = "openHoliday", source = "openHoliday", qualifiedByName = "convertToBoolean")
    CustomerLocationResponse toCustomerLocationResponse(Location location);

    @Named("convertToBoolean")
    default Boolean convertToBoolean(Integer data) {
        return data.equals(1);
    }
}
