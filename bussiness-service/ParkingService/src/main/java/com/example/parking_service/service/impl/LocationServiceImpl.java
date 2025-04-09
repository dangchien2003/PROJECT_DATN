package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.PartnerSearchLocation;
import com.example.parking_service.dto.response.LocationModifyResponse;
import com.example.parking_service.dto.response.LocationResponse;
import com.example.parking_service.entity.Location;
import com.example.parking_service.entity.LocationModify;
import com.example.parking_service.enums.LocationModifyStatus;
import com.example.parking_service.enums.LocationStatus;
import com.example.parking_service.mapper.LocationMapper;
import com.example.parking_service.mapper.LocationModifyMapper;
import com.example.parking_service.repository.LocationModifyRepository;
import com.example.parking_service.repository.LocationRepository;
import com.example.parking_service.service.LocationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class LocationServiceImpl implements LocationService {
    LocationRepository locationRepository;
    LocationModifyRepository locationModifyRepository;
    LocationModifyMapper locationModifyMapper;
    LocationMapper locationMapper;
    ObjectMapper objectMapper;

    @Override
    public ApiResponse<Object> searchLocationByPartner(PartnerSearchLocation request, Pageable pageable) {
        // kiểm tra giá trị tab
        if (DataUtils.isNullOrEmpty(request.getTab()) || !List.of(1, 2, 3, 4).contains(request.getTab())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không hợp lệ"));
        }

        String name = DataUtils.convertStringSearchLike(request.getName());
        // trạng thái
        Integer status = null;
        if (request.getTab().equals(1)) {
            status = LocationStatus.DANG_HOAT_DONG.getValue();
        } else if (request.getTab().equals(2)) {
            status = LocationStatus.TAM_DUNG_HOAT_DONG.getValue();
        } else if (request.getTab().equals(3)) {
            status = LocationModifyStatus.CHO_DUYET.getValue();
        } else if (request.getTab().equals(4)) {
            status = LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue();
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không hợp lệ"));
        }
        // mở cửa ngày lễ
        Integer openHoliday = null;
        if (Boolean.TRUE.equals(request.getOpenHoliday())) {
            openHoliday = 1;
        } else if (Boolean.FALSE.equals(request.getOpenHoliday())) {
            openHoliday = 0;
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không hợp lệ"));
        }

        if (List.of(1, 2).contains(request.getTab())) {
            // truy vấn
            Page<Location> dataPage = locationRepository.partnerSearch(
                    name,
                    request.getOpenTime(),
                    request.getCloseTime(),
                    openHoliday,
                    status,
                    ParkingServiceApplication.testPartnerActionBy,
                    pageable
            );
            List<LocationResponse> dataResponse = dataPage.stream()
                    .map(locationMapper::toLocationResponse).toList();

            return ApiResponse.builder()
                    .result(new PageResponse<>(dataResponse, dataPage.getTotalPages(), dataPage.getTotalElements()))
                    .build();
        } else if (List.of(3, 4).contains(request.getTab())) {
            // ngày áp dụng
            LocalDateTime applyDate = null;
            String trendApplyDate = null;
            if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit())) {
                // dữ liệu số dư
                if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit().getValue())) {
                    String applyDateStr = (String) request.getTimeAppliedEdit().getValue();
                    applyDate = LocalDateTime.parse(applyDateStr);
                }
                // cách tìm kiếm kết quả
                if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit().getTrend())) {
                    trendApplyDate = request.getTimeAppliedEdit().getTrend().toUpperCase(Locale.ROOT);
                }
            }
            // ngày gửi yêu cầu
            LocalDateTime fromRequestDate = null;
            LocalDateTime endRequestDate = null;
            if (!DataUtils.isNullOrEmpty(request.getCreatedDate()) && !request.getCreatedDate().isEmpty()) {
                fromRequestDate = request.getCreatedDate().getFirst().atStartOfDay();
                if (request.getCreatedDate().size() == 2) {
                    endRequestDate = request.getCreatedDate().get(1).atTime(LocalTime.MAX);
                }
            }
            // yêu cầu khân cấp
            Integer urgentApprovalRequest = null;
            if (Boolean.TRUE.equals(request.getUrgentApprovalRequest())) {
                urgentApprovalRequest = 1;
            } else if (Boolean.FALSE.equals(request.getUrgentApprovalRequest())) {
                urgentApprovalRequest = 0;
            } else {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không hợp lệ"));
            }
            // truy vấn
            Page<LocationModify> dataPage = locationModifyRepository.partnerSearch(
                    request.getCategory(),
                    name,
                    request.getOpenTime(),
                    request.getCloseTime(),
                    openHoliday,
                    status,
                    applyDate,
                    trendApplyDate,
                    fromRequestDate,
                    endRequestDate,
                    urgentApprovalRequest,
                    ParkingServiceApplication.testPartnerActionBy,
                    pageable
            );
            List<LocationModifyResponse> dataResponse = dataPage.stream()
                    .map(locationModifyMapper::toLocationModifyResponse).toList();

            return ApiResponse.builder()
                    .result(new PageResponse<>(dataResponse, dataPage.getTotalPages(), dataPage.getTotalElements()))
                    .build();
        }
        throw new AppException(ErrorCode.NOT_FOUND);
    }
}
