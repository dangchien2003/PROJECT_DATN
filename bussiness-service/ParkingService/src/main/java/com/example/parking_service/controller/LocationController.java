package com.example.parking_service.controller;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.service.LocationModifyService;
import com.example.parking_service.service.LocationService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/location")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class LocationController {
    LocationModifyService locationModifyService;
    LocationService locationService;

    @PostMapping("modify")
    @PreAuthorize("hasAnyAuthority('PARTNER')")
    ApiResponse<Object> modifyLocation(@Valid @RequestBody ModifyLocationRequest request) {
        return locationModifyService.modifyLocation(request);
    }

    @DeleteMapping("delete-modify")
    @PreAuthorize("hasAnyAuthority('PARTNER')")
    ApiResponse<Object> deleteModify(@RequestBody Long modifyId) {
        return locationModifyService.deleteModify(modifyId);
    }

    @PostMapping("partner/search")
    @PreAuthorize("hasAnyAuthority('PARTNER')")
    ApiResponse<Object> partnerSearch(@RequestBody PartnerSearchLocation data, Pageable pageable) {
        return locationService.searchLocationByPartner(data, pageable);
    }

    @PostMapping("admin/search")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> adminSearch(@RequestBody AdminSearchLocation data, Pageable pageable) {
        return locationService.searchLocationByAdmin(data, pageable);
    }

    @PostMapping("admin/search/wait-approve")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> adminSearchWaitApprove(@RequestBody AdminSearchLocation data, Pageable pageable) {
        return locationService.searchLocationWaitApproveByAdmin(data, pageable);
    }

    @PostMapping("approve")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> approve(@Valid @RequestBody ApproveRequest request) {
        return locationModifyService.approve(request);
    }

    @GetMapping("detail/modify")
    @PreAuthorize("hasAnyAuthority('PARTNER', 'ADMIN')")
    ApiResponse<Object> detailModify(@RequestParam("id") Long id) {
        return locationModifyService.detailModify(id);
    }

    @GetMapping("detail")
    @PreAuthorize("hasAnyAuthority('PARTNER', 'ADMIN')")
    ApiResponse<Object> detail(@RequestParam("id") Long id) {
        return locationService.details(List.of(id), true);
    }

    @GetMapping("customer/detail")
    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
    ApiResponse<Object> customerDetail(@RequestParam("id") Long id) {
        return locationService.customerDetail(id);
    }

    @GetMapping("detail/wait-release")
    @PreAuthorize("hasAnyAuthority('PARTNER', 'ADMIN')")
    ApiResponse<Object> detailWaitRelease(@RequestParam("id") Long id) {
        return locationService.detailWaitRelease(id);
    }

    @GetMapping("list/coordinates")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getListCoordinates(@RequestParam(value = "page", defaultValue = "0") int page) {
        return locationService.getListCoordinates(page);
    }

    @GetMapping("list/coordinates-of-partner")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    ApiResponse<Object> getListCoordinatesOfPartner(
            @RequestParam(value = "partnerId", required = false) String partnerId) {
        return locationService.getListCoordinatesOfPartner(partnerId);
    }

    @GetMapping("all/is-active")
    @PreAuthorize("hasAnyAuthority('PARTNER')")
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

    @GetMapping("statistics-of-used-positions")
    ApiResponse<Object> statisticsOfUsedPositions(
            @RequestParam("locationId") Long locationId,
            @RequestParam("date") LocalDate date
    ) {
        return locationService.statisticsOfUsedPositions(locationId, date);
    }

    @GetMapping("/suggestions")
    ApiResponse<Object> suggestions(@RequestParam("key") String key, Pageable pageable) {
        return locationService.suggestions(key, pageable);
    }
}
