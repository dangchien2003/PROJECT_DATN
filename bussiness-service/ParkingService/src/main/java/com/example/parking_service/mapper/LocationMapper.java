package com.example.parking_service.mapper;

import com.example.common.dto.Coordinates;
import com.example.parking_service.dto.response.LocationResponse;
import com.example.parking_service.dto.response.MapLocationResponse;
import com.example.parking_service.entity.Location;
import com.example.parking_service.entity.LocationWaitRelease;
import com.example.parking_service.utils.ConvertUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    @Mapping(target = "coordinates", source = "coordinates", qualifiedByName = "convertCoordinates")
    @Mapping(target = "openHoliday", source = "openHoliday", qualifiedByName = "convertToBoolean")
    LocationResponse toLocationResponse(Location entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    void toLocationFromReleaseEntity(@MappingTarget Location location, LocationWaitRelease releaseEntity);

    @Mapping(target = "coordinates", source = "coordinates", qualifiedByName = "convertCoordinates")
    MapLocationResponse toMapLocationResponse(Location location);

    @Named("convertCoordinates")
    default Coordinates convertCoordinates(String coordinatesString) {
        try {
            if (coordinatesString != null) {
                return ConvertUtil.objectMapper.readValue(coordinatesString, Coordinates.class);
            } else {
                return null;
            }
        } catch (JsonProcessingException e) {
            System.out.println(e);
            return null;
        }
    }

    @Named("convertToBoolean")
    default Boolean convertToBoolean(Integer data) {
        return data.equals(1);
    }
}
