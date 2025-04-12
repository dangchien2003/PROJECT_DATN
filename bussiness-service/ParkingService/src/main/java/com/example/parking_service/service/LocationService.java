package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.AdminSearchLocation;
import com.example.parking_service.dto.request.PartnerSearchLocation;
import org.springframework.data.domain.Pageable;

public interface LocationService {
    ApiResponse<Object> searchLocationByPartner(PartnerSearchLocation request, Pageable pageable);

    ApiResponse<Object> searchLocationWaitApproveByAdmin(AdminSearchLocation request, Pageable pageable);

    ApiResponse<Object> detail(Long id);

    ApiResponse<Object> detailWaitRelease(Long id);

}
