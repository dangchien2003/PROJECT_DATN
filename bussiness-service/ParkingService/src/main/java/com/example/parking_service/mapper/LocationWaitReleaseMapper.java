package com.example.parking_service.mapper;

import com.example.parking_service.dto.response.LocationWaitReleaseResponse;
import com.example.parking_service.entity.LocationModify;
import com.example.parking_service.entity.LocationWaitRelease;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface LocationWaitReleaseMapper {
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    LocationWaitRelease toLocationWaitRelease(LocationModify locationModify);

    @Mapping(target = "openHoliday", source = "openHoliday", qualifiedByName = "convertToBoolean")
    @Mapping(target = "isDel", source = "isDel", qualifiedByName = "convertToBoolean")
    @Mapping(target = "released", source = "released", qualifiedByName = "convertToBoolean")
    LocationWaitReleaseResponse toResponse(LocationWaitRelease entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "modifiedBy", ignore = true)
    void toLocationWaitReleaseFromModify(@MappingTarget LocationWaitRelease locationWaitRelease, LocationModify locationModify);

    @Named("convertToBoolean")
    default Boolean convertToBoolean(Integer data) {
        return data.equals(1);
    }
}
