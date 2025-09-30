package com.example.parking_service.service.impl;

import com.example.common.dto.kafka.PushNotifyRequest;
import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.Specification.TicketPurchasedSpecification;
import com.example.parking_service.dto.other.TicketQr;
import com.example.parking_service.dto.request.CancelTicketPurchasedRequest;
import com.example.parking_service.dto.request.CustomerSearchTicketPurchasedRequest;
import com.example.parking_service.dto.request.PartnerSearchHistoryBuyTicketPurchasedRequest;
import com.example.parking_service.dto.response.*;
import com.example.parking_service.entity.*;
import com.example.parking_service.enums.CheckinStatus;
import com.example.parking_service.enums.PermitEditContentPlate;
import com.example.parking_service.enums.TicketPurchasedStatus;
import com.example.parking_service.enums.TicketPurchasedUseStatus;
import com.example.parking_service.mapper.TicketPurchasedMapper;
import com.example.parking_service.repository.LocationRepository;
import com.example.parking_service.repository.TicketInOutRepository;
import com.example.parking_service.repository.TicketPurchaseRepository;
import com.example.parking_service.repository.TicketRepository;
import com.example.parking_service.service.CryptoService;
import com.example.parking_service.service.NotifyService;
import com.example.parking_service.service.TicketPurchasedService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
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
import java.util.*;
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
    CryptoService crypto;
    NotifyService notifyService;

    @Override
    public ApiResponse<Object> customerSearch(CustomerSearchTicketPurchasedRequest request, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, TicketPurchased_.CREATED_AT));
        // validate tab
        if (DataUtils.isNullOrEmpty(request.getTab())
                || !(List.of(1, 2, 3, 4).contains(request.getTab()))) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Tìm kiếm thất bại"));
        }

        String accountId = UserContextHolder.getContext().getUid();
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
        Set<Long> ticketIds = new HashSet<>();
        Set<Long> listLocationIdOfResult = new HashSet<>();
        ticketPurchasedPage.forEach(item -> {
            ticketIds.add(item.getTicketId());
            listLocationIdOfResult.add(item.getLocationId());
        });

        List<TicketNameDTO> ticketNames = ticketRepository.findDTOByTicketIdIn(ticketIds);
        List<LocationNameDTO> locationNames = locationRepository.getNameDto(listLocationIdOfResult);
        // chuyển về map
        Map<Long, TicketNameDTO> ticketNameDTOMap = ticketNames.stream()
                .collect(Collectors.toMap(TicketNameDTO::getTicketId, item -> item));
        Map<Long, LocationNameDTO> locationNameDTOMap = locationNames.stream()
                .collect(Collectors.toMap(LocationNameDTO::getLocationId, item -> item));

        List<CusTicketPurchasedSearchResponse> result = ticketPurchasedPage.map(item -> {
            CusTicketPurchasedSearchResponse response = ticketPurchasedMapper.toCusTicketPurchasedSearchResponse(item);
            TicketNameDTO ticketNameDTO = ticketNameDTOMap.get(item.getTicketId());
            if (ticketNameDTO != null) {
                response.setTicketName(ticketNameDTO.getName());
            }
            LocationNameDTO locationNameDTO = locationNameDTOMap.get(item.getLocationId());
            if (locationNameDTO != null) {
                response.setLocationName(locationNameDTO.getName());
                response.setAddress(locationNameDTO.getAddress());
            }
            return response;
        }).toList();

        return ApiResponse.builder()
                .result(new PageResponse<>(result, ticketPurchasedPage.getTotalPages(), ticketPurchasedPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getQr(String id) {
        String accountId = UserContextHolder.getContext().getUid();
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
        String accountId = UserContextHolder.getContext().getUid();
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
        String accountId = UserContextHolder.getContext().getUid();
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
        String accountId = UserContextHolder.getContext().getUid();
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
        String accountId = UserContextHolder.getContext().getUid();
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
        String accountId = UserContextHolder.getContext().getUid();
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

    @Override
    public ApiResponse<Object> historyBuyTicket(PartnerSearchHistoryBuyTicketPurchasedRequest request, String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        LocalDateTime fromBuyDate = null;
        LocalDateTime toBuyDate = null;
        LocalDateTime fromUseDate = null;
        LocalDateTime toUseDate = null;
        // xử lý ngày mua
        if (!DataUtils.isNullOrEmpty(request.getBuyDate())) {
            fromBuyDate = request.getBuyDate().getFirst()
                    .toLocalDate().atStartOfDay();
            // cuối ngày
            toBuyDate = request.getBuyDate().getLast()
                    .toLocalDate().atStartOfDay().plusHours(24)
                    .minus(1, ChronoUnit.MILLIS);
        }
        if (!DataUtils.isNullOrEmpty(request.getUseDate())) {
            fromUseDate = request.getUseDate().getFirst()
                    .toLocalDate().atStartOfDay();
            // cuối ngày
            toUseDate = request.getUseDate().getLast()
                    .toLocalDate().atStartOfDay().plusHours(24)
                    .minus(1, ChronoUnit.MILLIS);
        }
        Page<PartnerSearchHistoryBuyTicketPurchasedResponse> dataPage = ticketPurchaseRepository.historyBuyTicket(
                partnerId,
                request.getTicketId(),
                request.getStatus(),
                LocalDateTime.now(),
                fromBuyDate, toBuyDate,
                fromUseDate, toUseDate,
                pageQuery);
        return ApiResponse.builder()
                .result(new PageResponse<>(dataPage.getContent(), dataPage.getTotalPages(), dataPage.getTotalElements()))
                .build();
    }

    Integer getStatusCheckIn(TicketInOut ticketInOut) {
        if (ticketInOut.getCheckoutAt() != null) {
            return CheckinStatus.HOAN_THANH;
        } else {
            return CheckinStatus.DANG_GUI;
        }
    }

    @Override
    public void cancelTicketExpired() {
        LocalDateTime endTimeScan = LocalDateTime.now();
        List<Integer> statusScan = List.of(TicketPurchasedStatus.BINH_THUONG, TicketPurchasedStatus.TAM_DINH_CHI);
        List<TicketPurchased> entityList = ticketPurchaseRepository
                .findByExpiresLessThanEqualAndUseStatusAndStatusIn(endTimeScan, TicketPurchasedUseStatus.KHONG_SU_DUNG, statusScan);
        if (!entityList.isEmpty()) {
            entityList.forEach(item -> {
                item.setStatus(TicketPurchasedStatus.HUY_VE);
                DataUtils.setDataAction(item, "SCHEDULER", false);
            });
            ticketPurchaseRepository.saveAll(entityList);
        }
        log.info("Đã huỷ %d vé hết hạn".formatted(entityList.size()));
    }

    @Override
    public ApiResponse<Object> cancelTicket(CancelTicketPurchasedRequest request, String partnerId) {
        String actionBy = UserContextHolder.getContext().getUid();
        TicketPurchased ticketPurchased = ticketPurchaseRepository.findTicket(request.getId(), partnerId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        ticketPurchased.setStatus(TicketPurchasedStatus.BI_DINH_CHI);
        ticketPurchased.setCancelBy(actionBy);
        ticketPurchased.setReason(request.getReason());
        DataUtils.setDataAction(ticketPurchased, actionBy, false);
        ticketPurchaseRepository.save(ticketPurchased);
        try {
            // gửi thông báo
            PushNotifyRequest pushNotifyRequest1 = PushNotifyRequest.builder()
                    .to(ticketPurchased.getAccountId())
                    .title("Huỷ vé")
                    .content("Vé của bạn đã bị huỷ")
                    .link(String.format("/ticket/detail/%s", ticketPurchased.getId()))
                    .actionBy(actionBy)
                    .build();
            notifyService.pushNotify(pushNotifyRequest1);
        } catch (Exception e) {
            log.error("send notify error", e);
        }
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> adminDetail(String id, String partnerId) {
        TicketPurchased ticketPurchased = ticketPurchaseRepository.findByIdByAdmin(id, partnerId)
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
    public ApiResponse<Object> adminHistory(String ticketPurchasedId, String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "tio." + TicketInOut_.CHECKIN_AT));
        Page<TicketInOut> page = ticketInOutRepository.findHistoryByAdmin(ticketPurchasedId, partnerId, pageQuery);
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

    public void processBuyTicketSuccess(OrderParking order) throws JsonProcessingException {
        // mua mới
        List<TicketPurchased> ticketPurchasedSave = new ArrayList<>();
        if (order.getExtendTicketId() == null) {
            // mua cho bản thân
            if (order.getOwners() == null) {

                String id = UUID.randomUUID().toString();
                TicketQr ticketQr = TicketQr.builder()
                        .accountId(order.getPaymentBy())
                        .ticketId(id)
                        .createdAt(LocalDateTime.now())
                        .build();
                TicketPurchased ticketPurchased = null;
                try {
                    ticketPurchased = TicketPurchased.builder()
                            .accountId(order.getPaymentBy())
                            .ticketId(order.getTicketId())
                            .locationId(order.getLocationId())
                            .price(order.getTotal())
                            .status(TicketPurchasedStatus.BINH_THUONG)
                            .useStatus(TicketPurchasedUseStatus.KHONG_SU_DUNG)
                            .startsValidity(order.getStart())
                            .expires(order.getExpire())
                            .qrCode(crypto.encrypt(objectMapper.writeValueAsString(ticketQr)))
                            .createdQrCodeCount(1)
                            .permitEditContentPlate(PermitEditContentPlate.CO)
                            .usedTimes(0L)
                            .build();
                } catch (JsonProcessingException e) {
                    throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
                }
                DataUtils.setDataAction(ticketPurchased, order.getPaymentBy(), true);
                ticketPurchasedSave.add(ticketPurchased);
            } else {
                // mua hộ
                List<String> owners = objectMapper.readValue(order.getOwners(), new TypeReference<List<String>>() {
                });
                ticketPurchasedSave = owners.stream().map(item -> {
                    String id = UUID.randomUUID().toString();
                    TicketQr ticketQr = TicketQr.builder()
                            .accountId(item)
                            .ticketId(id)
                            .createdAt(LocalDateTime.now())
                            .build();
                    TicketPurchased ticketPurchased = null;
                    try {
                        ticketPurchased = TicketPurchased.builder()
                                .id(id)
                                .accountId(item)
                                .ticketId(order.getTicketId())
                                .locationId(order.getLocationId())
                                .price(order.getTotal())
                                .status(TicketPurchasedStatus.BINH_THUONG)
                                .useStatus(TicketPurchasedUseStatus.KHONG_SU_DUNG)
                                .startsValidity(order.getStart())
                                .expires(order.getExpire())
                                .qrCode(crypto.encrypt(objectMapper.writeValueAsString(ticketQr)))
                                .createdQrCodeCount(1)
                                .permitEditContentPlate(PermitEditContentPlate.CO)
                                .usedTimes(0L)
                                .build();
                    } catch (JsonProcessingException e) {
                        throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
                    }
                    DataUtils.setDataAction(ticketPurchased, order.getPaymentBy(), true);
                    return ticketPurchased;
                }).toList();
            }
        } else {
            // gia hạn
        }
        ticketPurchasedSave = ticketPurchaseRepository.saveAll(ticketPurchasedSave);
        if (order.getExtendTicketId() == null) {
            // mua cho bản thân
            if (order.getOwners() == null) {
                try {
                    // gửi thông báo
                    PushNotifyRequest pushNotifyRequest = PushNotifyRequest.builder()
                            .to(order.getPaymentBy())
                            .title("Mua vé thành công")
                            .content("Chúc mừng! Bạn đã mua thành công vé gửi xe. Nhấn để xem chi tiết")
                            .link(String.format("/ticket/detail/%s", ticketPurchasedSave.get(0).getId()))
                            .actionBy(order.getPaymentBy())
                            .build();
                    notifyService.pushNotify(pushNotifyRequest);
                } catch (Exception e) {
                    log.error("send notify error", e);
                }
            } else {
                try {
                    // gửi thông báo
                    PushNotifyRequest pushNotifyRequest = PushNotifyRequest.builder()
                            .to(order.getPaymentBy())
                            .title("Mua vé thành công")
                            .content(String.format("Chúc mừng! Bạn đã mua thành công vé gửi xe cho %s người khác", ticketPurchasedSave.size()))
                            .link(null)
                            .actionBy(order.getPaymentBy())
                            .build();
                    notifyService.pushNotify(pushNotifyRequest);
                    ticketPurchasedSave.forEach(item -> {
                        try {
                            // gửi thông báo
                            PushNotifyRequest pushNotifyRequest1 = PushNotifyRequest.builder()
                                    .to(item.getAccountId())
                                    .title("Mua vé thành công")
                                    .content("Chúc mừng! Bạn đã được mua hộ vé gửi xe. Nhấn để xem chi tiết")
                                    .link(String.format("/ticket/detail/%s", item.getId()))
                                    .actionBy(order.getPaymentBy())
                                    .build();
                            notifyService.pushNotify(pushNotifyRequest1);
                        } catch (Exception e) {
                            log.error("send notify error", e);
                        }
                    });
                } catch (Exception e) {
                    log.error("send notify error", e);
                }
            }
        } else {

        }
    }
}
