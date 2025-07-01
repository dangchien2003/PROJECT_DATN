package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.service.LocationModifyService;
import com.example.parking_service.service.LocationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/location")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class LocationController {
    LocationModifyService locationModifyService;
    LocationService locationService;

    @PostMapping("modify")
        // role đối tác
    ApiResponse<Object> modifyLocation(@Valid @RequestBody ModifyLocationRequest request) throws JsonProcessingException {
        String testActionBy = ParkingServiceApplication.testPartnerActionBy;
        return locationModifyService.modifyLocation(request, testActionBy);
    }

    @DeleteMapping("delete-modify")
        // role đối tác
    ApiResponse<Object> deleteModify(@RequestBody Long modifyId) {
        return locationModifyService.deleteModify(modifyId);
    }

    @PostMapping("partner/search")
        // role partner
    ApiResponse<Object> partnerSearch(@RequestBody PartnerSearchLocation data, Pageable pageable) {
        return locationService.searchLocationByPartner(data, pageable);
    }

    @PostMapping("admin/search")
        // role partner
    ApiResponse<Object> adminSearch(@RequestBody AdminSearchLocation data, Pageable pageable) {
        return locationService.searchLocationByAdmin(data, pageable);
    }

    @PostMapping("admin/search/wait-approve")
        // role admin
    ApiResponse<Object> adminSearchWaitApprove(@RequestBody AdminSearchLocation data, Pageable pageable) {
        return locationService.searchLocationWaitApproveByAdmin(data, pageable);
    }

    @PostMapping("approve")
    ApiResponse<Object> approve(@Valid @RequestBody ApproveRequest request) {
        return locationModifyService.approve(request);
    }

    @GetMapping("detail/modify")
    ApiResponse<Object> detailModify(@RequestParam("id") Long id) {
        return locationModifyService.detailModify(id);
    }

    @GetMapping("detail")
    ApiResponse<Object> detail(@RequestParam("id") Long id) {
        return locationService.details(List.of(id), true);
    }

    @GetMapping("customer/detail")
    ApiResponse<Object> customerDetail(@RequestParam("id") Long id) {
        return locationService.customerDetail(id);
    }

    @GetMapping("detail/wait-release")
    ApiResponse<Object> detailWaitRelease(@RequestParam("id") Long id) {
        return locationService.detailWaitRelease(id);
    }

    @GetMapping("list/coordinates")
    ApiResponse<Object> getListCoordinates(@RequestParam(value = "page", defaultValue = "0") int page) {
        return locationService.getListCoordinates(page);
    }

    @GetMapping("all/is-active")
    ApiResponse<Object> getAllIsActive(@RequestParam(value = "page", defaultValue = "0") int page) {
        return locationService.getAllIsActive(page);
    }

    @PostMapping("list/detail")
    ApiResponse<Object> listDetail(@RequestBody List<Long> ids) {
        return locationService.details(ids, false);
    }

    @PostMapping("customer/search")
    ApiResponse<Object> customerSearch(@RequestBody CustomerSearchLocation request, Pageable pageable) {
        return locationService.customerSearch(request, pageable);
    }
}
