package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.example.parking_service.service.LocationModifyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/location")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class LocationController {
    LocationModifyService locationModifyService;

    @PostMapping("modify")
        // role đối tác
    ApiResponse<Object> modifyLocation(@Valid @RequestBody ModifyLocationRequest request) throws JsonProcessingException {
        String testActionBy = "641a00fd-9936-4a95-aa0c-d2fbc0fca9a3";
        return locationModifyService.modifyLocation(request, testActionBy);
    }
}
