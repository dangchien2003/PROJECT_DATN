package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.example.parking_service.service.LocationModifyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/location")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class LocationController {
    LocationModifyService locationModifyService;

    @PostMapping("modify")
        // role đối tác
    ApiResponse<Object> modifyLocation(@Valid @RequestBody ModifyLocationRequest request) throws JsonProcessingException {
        String testActionBy = ParkingServiceApplication.testPartnerActionBy;
        return locationModifyService.modifyLocation(request, testActionBy);
    }

    @DeleteMapping("delete-modify")
    ApiResponse<Object> deleteModify(@RequestBody Long modifyId) {
        return locationModifyService.deleteModify(modifyId);
    }
}
