package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.Specification.TicketPurchasedSpecification;
import com.example.parking_service.dto.other.TicketQr;
import com.example.parking_service.dto.request.CustomerSearchTicketPurchasedRequest;
import com.example.parking_service.dto.response.*;
import com.example.parking_service.entity.TicketInOut;
import com.example.parking_service.entity.TicketInOut_;
import com.example.parking_service.entity.TicketPurchased;
import com.example.parking_service.entity.TicketPurchased_;
import com.example.parking_service.enums.CheckinStatus;
import com.example.parking_service.enums.TicketPurchasedStatus;
import com.example.parking_service.mapper.TicketPurchasedMapper;
import com.example.parking_service.repository.LocationRepository;
import com.example.parking_service.repository.TicketInOutRepository;
import com.example.parking_service.repository.TicketPurchaseRepository;
import com.example.parking_service.repository.TicketRepository;
import com.example.parking_service.service.CryptoService;
import com.example.parking_service.service.TicketPurchasedService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class TicketPurchasedServiceImpl implements TicketPurchasedService {
    TicketPurchaseRepository ticketPurchaseRepository;
    TicketRepository ticketRepository;
    LocationRepository locationRepository;
    TicketInOutRepository ticketInOutRepository;
    TicketPurchasedSpecification ticketPurchasedSpecification;
    TicketPurchasedMapper ticketPurchasedMapper;
    CryptoService cryptoService;
    ObjectMapper objectMapper;

    @Override
    public ApiResponse<Object> customerSearch(CustomerSearchTicketPurchasedRequest request, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, TicketPurchased_.CREATED_AT));
        // validate tab
        if (DataUtils.isNullOrEmpty(request.getTab())
                || !(List.of(1, 2, 3, 4).contains(request.getTab()))) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Tìm kiếm thất bại"));
        }

        String accountId = ParkingServiceApplication.testPartnerActionBy;

        LocalDateTime fromBuyDate = null;
        LocalDateTime toBuyDate = null;
        LocalDateTime useDate = null;
        // xử lý ngày mua
        if (!DataUtils.isNullOrEmpty(request.getBuyDate())) {
            fromBuyDate = request.getBuyDate().getFirst()
                    .toLocalDate().atStartOfDay();
            // cuối ngày
            toBuyDate = request.getBuyDate().getLast()
                    .toLocalDate().atStartOfDay().plusHours(24)
                    .minus(1, ChronoUnit.MILLIS);
        }
        // ngày sử dụng
        if (!DataUtils.isNullOrEmpty(request.getUseDate())) {
            useDate = request.getUseDate().toLocalDate().atStartOfDay();
        }
        // lấy danh sách địa điểm
        List<Long> locationIds = null;
        String locationName = DataUtils.convertStringSearchLike(request.getLocationName());
        if (locationName != null) {
            locationIds = locationRepository.getListIdByName(locationName);
        }

        Specification<TicketPurchased> specification = ticketPurchasedSpecification.customerSearch(
                locationIds, fromBuyDate, toBuyDate, useDate, request.getTab(), accountId
        );
        Page<TicketPurchased> ticketPurchasedPage = ticketPurchaseRepository.findAll(specification, pageQuery);
        // không có dữ liệu
        if (ticketPurchasedPage.isEmpty()) {
            return ApiResponse.builder()
                    .result(new PageResponse<>(new ArrayList<>(), 0, 0))
                    .build();
        }
        // lấy tên vé
        List<Long> ticketIds = ticketPurchasedPage.map(TicketPurchased::getTicketId).toList();
        List<TicketNameDTO> ticketNames = ticketRepository.findDTOByTicketIdIn(ticketIds);
        // chuyển về map
        Map<Long, TicketNameDTO> ticketNameDTOMap = ticketNames.stream()
                .collect(Collectors.toMap(TicketNameDTO::getTicketId, item -> item));
        List<CusTicketPurchasedSearchResponse> result = ticketPurchasedPage.map(item -> {
            CusTicketPurchasedSearchResponse response = ticketPurchasedMapper.toCusTicketPurchasedSearchResponse(item);
            TicketNameDTO ticketNameDTO = ticketNameDTOMap.get(item.getTicketId());
            if (ticketNameDTO != null) {
                response.setTicketName(ticketNameDTO.getName());
            }
            return response;
        }).toList();

        return ApiResponse.builder()
                .result(new PageResponse<>(result, ticketPurchasedPage.getTotalPages(), ticketPurchasedPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getQr(String id) {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        String qrCode = ticketPurchaseRepository.getQr(accountId, id, TicketPurchasedStatus.BINH_THUONG);
        if (qrCode == null) {
            throw new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy thông tin"));
        }
        return ApiResponse.builder()
                .result(qrCode)
                .build();
    }

    @Override
    public ApiResponse<Object> refreshQr(String id) {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        TicketPurchased ticketPurchased = ticketPurchaseRepository
                .findByIdAndAccountIdAndStatus(id, accountId, TicketPurchasedStatus.BINH_THUONG)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        // validate
        LocalDateTime now = LocalDateTime.now();
        if (!ticketPurchased.getStatus().equals(TicketPurchasedStatus.BINH_THUONG)
                || now.isAfter(ticketPurchased.getExpires())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Làm mới thất bại"));
        }
        TicketQr contentQr = TicketQr.builder()
                .ticketId(ticketPurchased.getId())
                .accountId(ticketPurchased.getAccountId())
                .createdAt(now)
                .build();
        // gen qr
        String qr = null;
        try {
            qr = cryptoService.encrypt(objectMapper.writeValueAsString(contentQr));
        } catch (JsonProcessingException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
        ticketPurchased.setQrCode(qr);
        // tăng số lượt tạo qr
        ticketPurchased.setCreatedQrCodeCount(ticketPurchased.getCreatedQrCodeCount() + 1);
        DataUtils.setDataAction(ticketPurchased, accountId, false);
        ticketPurchaseRepository.save(ticketPurchased);
        return ApiResponse.builder()
                .result(qr)
                .build();
    }

    @Override
    public ApiResponse<Object> detail(String id) {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        TicketPurchased ticketPurchased = ticketPurchaseRepository.findByIdAndAccountId(id, accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy thông tin vé")));
        CusTicketPurchasedDetailResponse response = ticketPurchasedMapper.toCusTicketPurchasedDetailResponse(ticketPurchased);
        // tên vé
        List<TicketNameDTO> ticketNameDTOS = ticketRepository.findDTOByTicketIdIn(List.of(ticketPurchased.getTicketId()));
        if (!ticketNameDTOS.isEmpty()) {
            response.setTicketName(ticketNameDTOS.getFirst().getName());
        }
        // lấy thông tin địa điểm
        List<LocationNameDTO> locationNameDTOS = locationRepository.getNameDto(List.of(ticketPurchased.getLocationId()));
        if (!locationNameDTOS.isEmpty()) {
            response.setLocationName(locationNameDTOS.getFirst().getName());
            response.setLocationAddress(locationNameDTOS.getFirst().getAddress());
        }
        return ApiResponse.builder()
                .result(response)
                .build();
    }

    @Override
    public ApiResponse<Object> disableTicket(String id) {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        TicketPurchased ticketPurchased = ticketPurchaseRepository.findByIdAndAccountId(id, accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy thông tin vé")));
        // kiểm tra trạng thái
        if (ticketPurchased.getStatus().equals(TicketPurchasedStatus.TAM_DINH_CHI)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé đã bị vô hiệu từ trước"));
        }
        // validate thời gian và trạng thái
        LocalDateTime now = LocalDateTime.now();
        if (!ticketPurchased.getStatus().equals(TicketPurchasedStatus.BINH_THUONG)
                || now.isAfter(ticketPurchased.getExpires())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể vô hiệu"));
        }
        ticketPurchased.setStatus(TicketPurchasedStatus.TAM_DINH_CHI);
        DataUtils.setDataAction(ticketPurchased, accountId, false);
        ticketPurchaseRepository.save(ticketPurchased);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> enableTicket(String id) {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        TicketPurchased ticketPurchased = ticketPurchaseRepository.findByIdAndAccountId(id, accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy thông tin vé")));
        // validate thời gian và trạng thái
        LocalDateTime now = LocalDateTime.now();
        if (!ticketPurchased.getStatus().equals(TicketPurchasedStatus.TAM_DINH_CHI)
                || now.isAfter(ticketPurchased.getExpires())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể huỷ vô hiệu"));
        }
        ticketPurchased.setStatus(TicketPurchasedStatus.BINH_THUONG);
        DataUtils.setDataAction(ticketPurchased, accountId, false);
        ticketPurchaseRepository.save(ticketPurchased);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> history(String ticketPurchasedId, Pageable pageable) {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        boolean exist = ticketPurchaseRepository.existsByIdAndAccountId(ticketPurchasedId, accountId);
        if (!exist) {
            throw new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy dữ liệu"));
        }
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, TicketInOut_.CHECKIN_AT));
        Page<TicketInOut> page = ticketInOutRepository.findByTicketPurchasedId(ticketPurchasedId, pageQuery);
        List<TicketInOutResponse> result = page.map(item -> TicketInOutResponse.builder()
                .id(item.getId())
                .checkinAt(item.getCheckinAt())
                .checkoutAt(item.getCheckoutAt())
                .status(getStatusCheckIn(item))
                .build()
        ).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, page.getTotalPages(), page.getTotalElements()))
                .build();
    }

    Integer getStatusCheckIn(TicketInOut ticketInOut) {
        if (ticketInOut.getCheckoutAt() != null) {
            return CheckinStatus.HOAN_THANH;
        } else {
            return CheckinStatus.DANG_GUI;
        }
    }
}
