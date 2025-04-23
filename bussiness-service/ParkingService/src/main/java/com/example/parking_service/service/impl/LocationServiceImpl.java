package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.enums.IsDel;
import com.example.common.enums.Release;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.AdminSearchLocation;
import com.example.parking_service.dto.request.PartnerSearchLocation;
import com.example.parking_service.dto.response.*;
import com.example.parking_service.entity.Account;
import com.example.parking_service.entity.Location;
import com.example.parking_service.entity.LocationModify;
import com.example.parking_service.entity.LocationWaitRelease;
import com.example.parking_service.enums.LocationModifyStatus;
import com.example.parking_service.enums.LocationStatus;
import com.example.parking_service.mapper.LocationMapper;
import com.example.parking_service.mapper.LocationModifyMapper;
import com.example.parking_service.mapper.LocationWaitReleaseMapper;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.repository.LocationModifyRepository;
import com.example.parking_service.repository.LocationRepository;
import com.example.parking_service.repository.LocationWaitReleaseRepository;
import com.example.parking_service.service.LocationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class LocationServiceImpl implements LocationService {
    LocationRepository locationRepository;
    LocationModifyRepository locationModifyRepository;
    AccountRepository accountRepository;
    LocationWaitReleaseRepository locationWaitReleaseRepository;
    LocationModifyMapper locationModifyMapper;
    LocationMapper locationMapper;
    LocationWaitReleaseMapper locationWaitReleaseMapper;
    ObjectMapper objectMapper;

    @Override
    public ApiResponse<Object> getAllIsActive(int page) {
        String partner = ParkingServiceApplication.testPartnerActionBy;
        Pageable fixedPageable = PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "name"));
        Page<Location> pageLocations = locationRepository.findAllByStatusAndPartnerId(LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue(), partner, fixedPageable);
        List<Location> locations = pageLocations.getContent();
        List<LocationResponse> mapLocationResponses = locations.stream()
                .map(item -> LocationResponse.builder()
                        .locationId(item.getLocationId())
                        .name(item.getName())
                        .build()
                ).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(mapLocationResponses, pageLocations.getTotalPages(), pageLocations.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getListCoordinates(int page) {
        Pageable fixedPageable = PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "coordinates"));
        Page<Location> pageLocations = locationRepository.findAllByStatusAndCoordinatesNotNull(LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue(), fixedPageable);
        List<Location> locations = pageLocations.getContent();
        Set<String> partnerId = locations.stream().map(Location::getPartnerId).collect(Collectors.toSet());
        List<Account> accounts = accountRepository.findAllById(partnerId);
        Map<String, Account> accountMap = accounts.stream().collect(Collectors.toMap(Account::getId, item -> item));
        List<MapLocationResponse> mapLocationResponses = locations.stream().map(item -> {
            MapLocationResponse mapLocationResponse = locationMapper.toMapLocationResponse(item);
            mapLocationResponse.setPartnerFullName(accountMap.get(mapLocationResponse.getPartnerId()).getPartnerFullName());
            return mapLocationResponse;
        }).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(mapLocationResponses, pageLocations.getTotalPages(), pageLocations.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> detailWaitRelease(Long id) {
        boolean roleAdmin = false;
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        LocationWaitRelease entity = locationWaitReleaseRepository.findByIdAndIsDel(id, IsDel.DELETE_NOT_YET.getValue())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!roleAdmin && !entity.getPartnerId().equals(accountId)) {
            throw new AppException(ErrorCode.NO_ACCESS);
        }
        return ApiResponse.builder()
                .result(locationWaitReleaseMapper.toResponse(entity))
                .build();
    }

    @Override
    public ApiResponse<Object> detail(Long id) {
        boolean roleAdmin = false;
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!roleAdmin && !location.getPartnerId().equals(accountId)) {
            throw new AppException(ErrorCode.NO_ACCESS);
        }
        return ApiResponse.builder()
                .result(locationMapper.toLocationResponse(location))
                .build();
    }

    @Override
    public ApiResponse<Object> searchLocationByPartner(PartnerSearchLocation request, Pageable pageable) {
        // kiểm tra giá trị tab
        if (DataUtils.isNullOrEmpty(request.getTab()) || !List.of(1, 2, 3, 4, 5).contains(request.getTab())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không hợp lệ"));
        }

        String name = DataUtils.convertStringSearchLike(request.getName());
        // trạng thái
        Integer status = null;
        if (request.getTab().equals(1)) {
            status = LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue();
        } else if (request.getTab().equals(2)) {
            status = LocationStatus.TAM_DUNG_HOAT_DONG.getValue();
        } else if (request.getTab().equals(3)) {
            status = LocationModifyStatus.CHO_DUYET.getValue();
        } else if (request.getTab().equals(4)) {
            status = LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue();
        } else if (request.getTab().equals(5)) {
            status = LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue();
        }

        if (List.of(1, 2).contains(request.getTab())) {
            // truy vấn
            Page<Location> dataPage = locationRepository.partnerSearch(
                    name,
                    request.getOpenTime(),
                    request.getCloseTime(),
                    request.getOpenHoliday(),
                    status,
                    ParkingServiceApplication.testPartnerActionBy,
                    pageable
            );
            List<LocationResponse> dataResponse = dataPage.stream()
                    .map(locationMapper::toLocationResponse).toList();

            return ApiResponse.builder()
                    .result(new PageResponse<>(dataResponse, dataPage.getTotalPages(), dataPage.getTotalElements()))
                    .build();
        } else if (request.getTab().equals(5)) {
            // truy vấn
            Page<LocationWaitRelease> dataPage = locationWaitReleaseRepository.partnerSearch(
                    name,
                    request.getOpenTime(),
                    request.getCloseTime(),
                    request.getOpenHoliday(),
                    status,
                    ParkingServiceApplication.testPartnerActionBy,
                    IsDel.DELETE_NOT_YET.getValue(),
                    Release.RELEASE_NOT_YET.getValue(),
                    pageable
            );
            List<LocationWaitReleaseResponse> dataResponse = dataPage.stream()
                    .map(locationWaitReleaseMapper::toResponse).toList();

            return ApiResponse.builder()
                    .result(new PageResponse<>(dataResponse, dataPage.getTotalPages(), dataPage.getTotalElements()))
                    .build();
        } else {
            // ngày áp dụng
            LocalDateTime applyDate = null;
            String trendApplyDate = null;
            if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit())) {
                // dữ liệu
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
            // truy vấn
            Page<LocationModify> dataPage = locationModifyRepository.partnerSearch(
                    request.getCategory(),
                    name,
                    request.getOpenTime(),
                    request.getCloseTime(),
                    request.getOpenHoliday(),
                    status,
                    applyDate,
                    trendApplyDate,
                    fromRequestDate,
                    endRequestDate,
                    request.getUrgentApprovalRequest(),
                    LocalDateTime.now(),
                    ParkingServiceApplication.testPartnerActionBy,
                    IsDel.DELETE_NOT_YET.getValue(),
                    pageable
            );
            List<LocationModifyResponse> dataResponse = dataPage.stream()
                    .map(locationModifyMapper::toLocationModifyResponse).toList();

            return ApiResponse.builder()
                    .result(new PageResponse<>(dataResponse, dataPage.getTotalPages(), dataPage.getTotalElements()))
                    .build();
        }
    }

    @Override
    public ApiResponse<Object> searchLocationWaitApproveByAdmin(AdminSearchLocation request, Pageable pageable) {
        // kiểm tra giá trị tab
        if (DataUtils.isNullOrEmpty(request.getTab()) || !List.of(3, 4, 5).contains(request.getTab())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không hợp lệ"));
        }

        String partnerName = DataUtils.convertStringSearchLike(request.getPartnerName());
        // trạng thái chỉnh sửa
        Integer modifyStatus = null;
        Integer urgentApprovalRequest = null;
        Integer category = null;
        if (request.getTab().equals(3) || request.getTab().equals(4)) {
            modifyStatus = LocationModifyStatus.CHO_DUYET.getValue();
            // không áp dụng cho từ chối
            urgentApprovalRequest = request.getUrgentApprovalRequest();
            if (request.getTab().equals(3)) {
                category = 1;
            } else {
                category = 2;
            }
        } else {
            modifyStatus = LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue();
        }

        // ngày áp dụng
        LocalDateTime applyTime = null;
        String trendApplyTime = null;
        if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit())) {
            // dữ liệu
            if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit().getValue())) {
                String applyDateStr = (String) request.getTimeAppliedEdit().getValue();
                applyTime = LocalDateTime.parse(applyDateStr);
            }
            // cách tìm kiếm kết quả
            if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit().getTrend())) {
                trendApplyTime = request.getTimeAppliedEdit().getTrend().toUpperCase(Locale.ROOT);
            }
        }

        // ngày yêu cầu
        LocalDateTime createdTime = null;
        String trendCreatedTime = null;
        if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit())) {
            // dữ liệu số dư
            if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit().getValue())) {
                String applyDateStr = (String) request.getTimeAppliedEdit().getValue();
                createdTime = LocalDateTime.parse(applyDateStr);
            }
            // cách tìm kiếm kết quả
            if (!DataUtils.isNullOrEmpty(request.getTimeAppliedEdit().getTrend())) {
                trendCreatedTime = request.getTimeAppliedEdit().getTrend().toUpperCase(Locale.ROOT);
            }
        }
        int limit = pageable.getPageSize();
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<AdminSearchLocationWaitApproveResponse> data = locationModifyRepository.adminSearchModify(
                category,
                partnerName,
                modifyStatus,
                urgentApprovalRequest,
                applyTime,
                trendApplyTime,
                createdTime,
                trendCreatedTime,
                IsDel.DELETE_NOT_YET.getValue(),
                limit,
                offset
        );

        // sắp xếp dữ liệu
        Sort sort = pageable.getSort();
        if (sort.isSorted()) {
            for (Sort.Order order : sort) {
                Comparator<AdminSearchLocationWaitApproveResponse> comparator = getComparatorWaitApprove(order.getProperty());

                if (comparator != null) {
                    if (order.getDirection() == Sort.Direction.DESC) {
                        comparator = comparator.reversed();
                    }
                    data.sort(comparator);
                }
            }
        }

        Long countAllRecord = locationModifyRepository.countAllRecordWaitApprove(
                category,
                modifyStatus,
                IsDel.DELETE_NOT_YET.getValue()
        );
        long totalPage = (long) Math.ceil((double) data.size() / limit);
        return ApiResponse.builder()
                .result(new PageResponse<>(data, totalPage, countAllRecord))
                .build();
    }

    @Override
    public ApiResponse<Object> searchLocationByAdmin(AdminSearchLocation request, Pageable pageable) {
        String partnerFullName = DataUtils.convertStringSearchLike(request.getPartnerName());
        String locationName = DataUtils.convertStringSearchLike(request.getName());
        Integer status = null;
        if (request.getTab() == 1) {
            status = LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue();
        } else if (request.getTab() == 2) {
            status = LocationStatus.TAM_DUNG_HOAT_DONG.getValue();
        } else if (request.getTab() == 6) {
            // ngưng hoạt động
            status = LocationStatus.NGUNG_HOAT_DONG.getValue();
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không hợp lệ"));
        }

        int limit = pageable.getPageSize();
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<AdminSearchLocationResponse> data = locationRepository.adminSearch(
                status,
                partnerFullName,
                locationName,
                request.getOpenTime(),
                request.getCloseTime(),
                request.getCapacity(),
                request.getOpenHoliday(),
                limit,
                offset
        );

        // sắp xếp dữ liệu
        Sort sort = pageable.getSort();
        if (sort.isSorted()) {
            for (Sort.Order order : sort) {
                Comparator<AdminSearchLocationResponse> comparator = getComparator(order.getProperty());
                if (comparator != null) {
                    if (order.getDirection() == Sort.Direction.DESC) {
                        comparator = comparator.reversed();
                    }
                    data.sort(comparator);
                }
            }
        }

        Long countAllRecord = locationModifyRepository.countAllRecord(
                status
        );
        long totalPage = (long) Math.ceil((double) data.size() / limit);
        return ApiResponse.builder()
                .result(new PageResponse<>(data, totalPage, countAllRecord))
                .build();
    }

    Comparator<AdminSearchLocationWaitApproveResponse> getComparatorWaitApprove(String property) {
        return switch (property) {
            case "name" ->
                    Comparator.comparing(AdminSearchLocationWaitApproveResponse::getName, Comparator.nullsLast(String::compareToIgnoreCase));
            case "createdAt" ->
                    Comparator.comparing(AdminSearchLocationWaitApproveResponse::getCreatedAt, Comparator.nullsLast(LocalDateTime::compareTo));
            case "timeAppliedEdit" ->
                    Comparator.comparing(AdminSearchLocationWaitApproveResponse::getTimeAppliedEdit, Comparator.nullsLast(LocalDateTime::compareTo));
            case "partnerFullName" ->
                    Comparator.comparing(AdminSearchLocationWaitApproveResponse::getPartnerFullName, Comparator.nullsLast(String::compareToIgnoreCase));
            default -> null;
        };
    }

    Comparator<AdminSearchLocationResponse> getComparator(String property) {
        return switch (property) {
            case "name" ->
                    Comparator.comparing(AdminSearchLocationResponse::getName, Comparator.nullsLast(String::compareToIgnoreCase));
            case "openDate" ->
                    Comparator.comparing(AdminSearchLocationResponse::getOpenDate, Comparator.nullsLast(LocalDateTime::compareTo));
            case "capacity" ->
                    Comparator.comparing(AdminSearchLocationResponse::getCapacity, Comparator.nullsLast(Long::compareTo));
            default -> null;
        };
    }

}
