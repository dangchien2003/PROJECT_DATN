package com.example.parking_service.mapper;

import com.example.common.dto.Coordinates;
import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.example.parking_service.dto.response.LocationModifyResponse;
import com.example.parking_service.entity.LocationModify;
import com.example.parking_service.utils.ConvertUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface LocationModifyMapper {

    @Mapping(target = "coordinates", ignore = true)
    LocationModify toLocationModify(ModifyLocationRequest dto);

    @Mapping(target = "coordinates", source = "coordinates", qualifiedByName = "convertCoordinates")
    @Mapping(target = "openHoliday", source = "openHoliday", qualifiedByName = "convertToBoolean")
    @Mapping(target = "urgentApprovalRequest", source = "urgentApprovalRequest", qualifiedByName = "convertToBoolean")
    @Mapping(target = "isDel", source = "isDel", qualifiedByName = "convertToBoolean")
    LocationModifyResponse toLocationModifyResponse(LocationModify entity);

    @Named("convertCoordinates")
    default Coordinates convertCoordinates(String coordinatesString) {
        try {
            if (coordinatesString != null) {
                return ConvertUtil.objectMapper.readValue(coordinatesString, Coordinates.class);
            } else {
                return null;
            }
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Named("convertToBoolean")
    default Boolean convertToBoolean(Integer data) {
        return data.equals(1);
    }
}
