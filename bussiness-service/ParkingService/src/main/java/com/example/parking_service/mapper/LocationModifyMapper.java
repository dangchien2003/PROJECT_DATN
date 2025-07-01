package com.example.parking_service.mapper;

import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.example.parking_service.dto.response.LocationModifyResponse;
import com.example.parking_service.entity.LocationModify;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface LocationModifyMapper {

    LocationModify toLocationModify(ModifyLocationRequest dto);

    @Mapping(target = "openHoliday", source = "openHoliday", qualifiedByName = "convertToBoolean")
    @Mapping(target = "urgentApprovalRequest", source = "urgentApprovalRequest", qualifiedByName = "convertToBoolean")
    @Mapping(target = "isDel", source = "isDel", qualifiedByName = "convertToBoolean")
    LocationModifyResponse toLocationModifyResponse(LocationModify entity);

    @Named("convertToBoolean")
    default Boolean convertToBoolean(Integer data) {
        return data.equals(1);
    }
}
