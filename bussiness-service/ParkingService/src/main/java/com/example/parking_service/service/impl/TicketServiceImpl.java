package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.enums.IsDel;
import com.example.common.enums.Release;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.other.PriceTicket;
import com.example.parking_service.dto.other.ScheduledJobId;
import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.entity.Ticket;
import com.example.parking_service.entity.TicketLocation;
import com.example.parking_service.entity.TicketPrice;
import com.example.parking_service.entity.TicketWaitRelease;
import com.example.parking_service.enums.*;
import com.example.parking_service.mapper.TicketMapper;
import com.example.parking_service.mapper.TicketWaitReleaseMapper;
import com.example.parking_service.repository.*;
import com.example.parking_service.service.SchedulerService;
import com.example.parking_service.service.TicketService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class TicketServiceImpl implements TicketService {
    LocationRepository locationRepository;
    TicketRepository ticketRepository;
    TicketPriceRepository ticketPriceRepository;
    TicketLocationRepository ticketLocationRepository;
    TicketWaitReleaseRepository ticketWaitReleaseRepository;
    SchedulerService schedulerService;
    TicketMapper ticketMapper;
    TicketWaitReleaseMapper ticketWaitReleaseMapper;

    @Override
    public ApiResponse<Object> modifyTicket(ModifyTicketRequest request) {
        // kiểm tra thời gian áp dụng
        Duration duration = Duration.between(LocalDateTime.now(), request.getTimeAppliedEdit());
        if (duration.toDays() < 1) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thời gian áp dụng chưa tuân thủ thời gian tối thiểu"));
        }

        String partnerId = ParkingServiceApplication.testPartnerActionBy;
        boolean isCreate = false;
        Ticket ticket = null;
        if (DataUtils.isNullOrEmpty(request.getTicketId())) {
            isCreate = true;
        } else {
            // kiểm tra sự tồn tại của vé và quyền
            Optional<Ticket> ticketOptional = ticketRepository.findById(request.getTicketId());
            if (ticketOptional.isEmpty() || !ticketOptional.get().getPartnerId().equals(partnerId)) {
                throw new AppException(ErrorCode.NOT_FOUND);
            }
            ticket = ticketOptional.get();
        }
        // xử lý khi tạo mới
        if (isCreate) {
            TicketWaitRelease ticketWaitRelease = ticketWaitReleaseMapper.toTicketWaitRelease(request);
            ticketWaitRelease.setIsDel(IsDel.DELETE_NOT_YET.getValue());
            ticketWaitRelease.setReleased(Release.RELEASE_NOT_YET.getValue());
            ticketWaitRelease.setPartnerId(partnerId);
            ticketWaitRelease.setModifyCount(0);
            ticketWaitRelease.setStatus(0);
            DataUtils.setDataAction(ticketWaitRelease, partnerId, true);
            ticketWaitRelease = ticketWaitReleaseRepository.save(ticketWaitRelease);
            // lưu giá
            savePrice(request, ticketWaitRelease, partnerId);
            // lưu địa điểm
            saveLocationUse(request, ticketWaitRelease, partnerId);
        } else {
            // kiểm tra có tồn tại bản ghi chờ áp dụng hay không
            if (ticketWaitReleaseRepository.existsByTicketIdAndIsDelAndReleased(ticket.getTicketId(),
                    IsDel.DELETE_NOT_YET.getValue(), Release.RELEASE_NOT_YET.getValue())) {
                throw new AppException(ErrorCode.CONFLICT_DATA.withMessage("Đang tồn tại bản ghi chờ áp dụng, tiến hành huỷ để tiếp tục"));
            }
            // lưu trạng thái vé
            ticket.setModifyCount(ticket.getModifyCount() + 1);
            ticket.setModifyStatus(TicketModifyStatus.CHO_AP_DUNG);
            DataUtils.setDataAction(ticket, partnerId, false);
            ticket = ticketRepository.save(ticket);
            // chuyển dữ liệu sang chờ áp dụng
            TicketWaitRelease ticketWaitRelease = ticketWaitReleaseMapper.toTicketWaitRelease(ticket);
            // map dữ liệu thay đổi
            ticketWaitReleaseMapper.mapWithModifyRequest(ticketWaitRelease, request);
            // set data
            ticketWaitRelease.setIsDel(IsDel.DELETE_NOT_YET.getValue());
            ticketWaitRelease.setReleased(Release.RELEASE_NOT_YET.getValue());
            DataUtils.setDataAction(ticketWaitRelease, partnerId, true);
            // lưu bản ghi
            ticketWaitRelease = ticketWaitReleaseRepository.save(ticketWaitRelease);
            // lưu giá chờ áp dụng
            savePrice(request, ticketWaitRelease, partnerId);
            // lưu địa điểm chờ áp dụng
            saveLocationUse(request, ticketWaitRelease, partnerId);
        }
        return ApiResponse.builder().build();
    }

    private void saveLocationUse(ModifyTicketRequest request, TicketWaitRelease ticketWaitRelease, String partnerId) {
        List<TicketLocation> ticketLocations = new ArrayList<>();
        if (request.getLocationUse() == null || !request.getLocationUse().isEmpty()) {
            Long countExist = locationRepository.countByPartnerIdAndStatusAndLocationIdIn(partnerId, LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue(), request.getLocationUse());
            // so sánh tất cả địa điểm có đang hoạt động hay không
            if (countExist != request.getLocationUse().size()) {
                throw new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy địa điểm"));
            }
        }
        for (Long item : request.getLocationUse()) {
            TicketLocation ticketLocation = TicketLocation.builder()
                    .objectId(ticketWaitRelease.getId())
                    .type(TypeTicket.CHO_AP_DUNG.getValue())
                    .locationId(item)
                    .isDel(IsDel.DELETE_NOT_YET.getValue())
                    .build();
            DataUtils.setDataAction(ticketLocation, partnerId, true);
            ticketLocations.add(ticketLocation);
        }
        ticketLocationRepository.saveAll(ticketLocations);
    }

    private void savePrice(ModifyTicketRequest request, TicketWaitRelease ticketWaitRelease, String actionBy) {
        PriceTicket priceTicket = request.getPrice();
        List<TicketPrice> ticketPrices = new ArrayList<>();
        if (request.isTimeSlot()) {
            if (priceTicket.getTime() == null) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Giá vé giờ không được để trống"));
            } else {
                TicketPrice ticketPrice = TicketPrice.builder()
                        .objectId(ticketWaitRelease.getId())
                        .type(TypeTicket.CHO_AP_DUNG.getValue())
                        .price(priceTicket.getTime())
                        .priceCategory(PriceCategory.TIME)
                        .isDel(IsDel.DELETE_NOT_YET.getValue())
                        .build();
                DataUtils.setDataAction(ticketPrice, actionBy, true);
                ticketPrices.add(ticketPrice);
            }
        }

        if (request.isDaySlot()) {
            if (priceTicket.getDay() == null) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Giá vé ngày không được để trống"));
            } else {
                TicketPrice ticketPrice = TicketPrice.builder()
                        .objectId(ticketWaitRelease.getId())
                        .type(TypeTicket.CHO_AP_DUNG.getValue())
                        .price(priceTicket.getDay())
                        .priceCategory(PriceCategory.DAY)
                        .isDel(IsDel.DELETE_NOT_YET.getValue())
                        .build();
                DataUtils.setDataAction(ticketPrice, actionBy, true);
                ticketPrices.add(ticketPrice);
            }
        }

        if (request.isWeekSlot()) {
            if (priceTicket.getWeek() == null) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Giá vé tuần không được để trống"));
            } else {
                TicketPrice ticketPrice = TicketPrice.builder()
                        .objectId(ticketWaitRelease.getId())
                        .type(TypeTicket.CHO_AP_DUNG.getValue())
                        .price(priceTicket.getWeek())
                        .priceCategory(PriceCategory.WEEK)
                        .isDel(IsDel.DELETE_NOT_YET.getValue())
                        .build();
                DataUtils.setDataAction(ticketPrice, actionBy, true);
                ticketPrices.add(ticketPrice);
            }
        }

        if (request.isMonthSlot()) {
            if (priceTicket.getMonth() == null) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Giá vé ngày không được để trống"));
            } else {
                TicketPrice ticketPrice = TicketPrice.builder()
                        .objectId(ticketWaitRelease.getId())
                        .type(TypeTicket.CHO_AP_DUNG.getValue())
                        .price(priceTicket.getMonth())
                        .priceCategory(PriceCategory.MONTH)
                        .isDel(IsDel.DELETE_NOT_YET.getValue())
                        .build();
                DataUtils.setDataAction(ticketPrice, actionBy, true);
                ticketPrices.add(ticketPrice);
            }
        }
        ticketPriceRepository.saveAll(ticketPrices);
    }

    public void cancelWaitRelease(Long id, boolean isAdmin) {
        String actionBy;
        if (isAdmin) {
            actionBy = ParkingServiceApplication.testAdminUUID;
        } else {
            actionBy = ParkingServiceApplication.testPartnerActionBy;
        }
        // xoá hàng hàng đợi trong db
        Optional<TicketWaitRelease> optionalTicketWaitRelease = ticketWaitReleaseRepository
                .findByTicketIdAndIsDelAndReleased(id,
                        IsDel.DELETE_NOT_YET.getValue(), Release.RELEASE_NOT_YET.getValue());
        if (optionalTicketWaitRelease.isPresent()) {
            TicketWaitRelease ticketWaitReleaseOld = optionalTicketWaitRelease.get();
            // kiểm tra thời gian áp dụng
            Duration duration1 = Duration.between(LocalDateTime.now(), ticketWaitReleaseOld.getTimeAppliedEdit());
            if (duration1.toHours() < 1) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể xoá bản ghi sắp áp dụng"));
            }
            ticketWaitReleaseOld.setIsDel(IsDel.DELETED.getValue());
            DataUtils.setDataAction(ticketWaitReleaseOld, actionBy, false);
            ticketWaitReleaseRepository.save(ticketWaitReleaseOld);
            // xoá task nếu có
            schedulerService.removeTask(new ScheduledJobId(ModuleName.TICKET, ticketWaitReleaseOld.getTicketId().toString()));
            // xoá giá vé
            List<TicketPrice> ticketPrices = ticketPriceRepository.findAllByObjectIdAndTypeAndIsDel(
                    ticketWaitReleaseOld.getTicketId(), TypeTicket.CHO_AP_DUNG.getValue(), IsDel.DELETE_NOT_YET.getValue());
            for (TicketPrice item : ticketPrices) {
                item.setIsDel(IsDel.DELETED.getValue());
                DataUtils.setDataAction(item, actionBy, false);
            }
            ticketPriceRepository.saveAll(ticketPrices);
            // xoá địa điểm sử dụng
            List<TicketLocation> ticketLocations = ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                    ticketWaitReleaseOld.getTicketId(), TypeTicket.CHO_AP_DUNG.getValue(), IsDel.DELETE_NOT_YET.getValue());
            for (TicketLocation item : ticketLocations) {
                item.setIsDel(IsDel.DELETED.getValue());
                DataUtils.setDataAction(item, actionBy, false);
            }
            ticketLocationRepository.saveAll(ticketLocations);
        }
    }
}
