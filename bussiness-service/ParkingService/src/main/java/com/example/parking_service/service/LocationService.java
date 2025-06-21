package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AdminSearchLocation;
import com.example.parking_service.dto.request.CustomerSearchLocation;
import com.example.parking_service.dto.request.PartnerSearchLocation;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface LocationService {
    ApiResponse<Object> searchLocationByPartner(PartnerSearchLocation request, Pageable pageable);

    ApiResponse<Object> searchLocationWaitApproveByAdmin(AdminSearchLocation request, Pageable pageable);

    ApiResponse<Object> searchLocationByAdmin(AdminSearchLocation request, Pageable pageable);

    ApiResponse<Object> details(List<Long> ids, boolean isDetail);

    ApiResponse<Object> detailWaitRelease(Long id);

    ApiResponse<Object> getListCoordinates(int page);

    ApiResponse<Object> getAllIsActive(int page);

    ApiResponse<Object> customerSearch(CustomerSearchLocation request, Pageable pageable);

}
