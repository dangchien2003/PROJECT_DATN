package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.enums.IsDel;
import com.example.common.enums.Release;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.other.PriceTicket;
import com.example.parking_service.dto.other.ScheduledJobId;
import com.example.parking_service.dto.request.ApproveRequest;
import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.dto.request.SearchTicket;
import com.example.parking_service.dto.response.DataSearchTicketResponse;
import com.example.parking_service.dto.response.PriceResponse;
import com.example.parking_service.entity.*;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class TicketServiceImpl implements TicketService {
    AccountRepository accountRepository;
    LocationRepository locationRepository;
    TicketRepository ticketRepository;
    TicketPriceRepository ticketPriceRepository;
    TicketLocationRepository ticketLocationRepository;
    TicketWaitReleaseRepository ticketWaitReleaseRepository;
    SchedulerService schedulerService;
    TicketMapper ticketMapper;
    TicketWaitReleaseMapper ticketWaitReleaseMapper;

    @Override
    public ApiResponse<Object> cancelWaitRelease(ApproveRequest approveRequest, boolean isAdmin) {
        Long id = Long.parseLong(approveRequest.getId());
        String actionBy;
        if (isAdmin) {
            actionBy = ParkingServiceApplication.testAdminUUID;
        } else {
            actionBy = ParkingServiceApplication.testPartnerActionBy;
        }
        // xoá hàng hàng đợi trong db
        TicketWaitRelease optionalTicketWaitRelease = ticketWaitReleaseRepository
                .findByIdAndIsDelAndReleased(id,
                        IsDel.DELETE_NOT_YET.getValue(), Release.RELEASE_NOT_YET.getValue())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy dữ liệu bản ghi")));
        // kiểm tra thời gian áp dụng
        Duration duration1 = Duration.between(LocalDateTime.now(), optionalTicketWaitRelease.getTimeAppliedEdit());
        if (duration1.toHours() < 1) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể xoá bản ghi sắp áp dụng"));
        }
        // thêm trường reject nê là admin
        if (isAdmin) {
            optionalTicketWaitRelease.setRejectBy(actionBy);
            optionalTicketWaitRelease.setReasonReject(approveRequest.getReason());
        }
        optionalTicketWaitRelease.setIsDel(IsDel.DELETED.getValue());
        DataUtils.setDataAction(optionalTicketWaitRelease, actionBy, false);
        optionalTicketWaitRelease = ticketWaitReleaseRepository.save(optionalTicketWaitRelease);
        // xoá task nếu có
        schedulerService.removeTask(new ScheduledJobId(ModuleName.TICKET, optionalTicketWaitRelease.getId().toString()));
        // xoá giá vé
        List<TicketPrice> ticketPrices = ticketPriceRepository.findAllByObjectIdAndTypeAndIsDel(
                optionalTicketWaitRelease.getTicketId(), TypeTicket.CHO_AP_DUNG.getValue(), IsDel.DELETE_NOT_YET.getValue());
        for (TicketPrice item : ticketPrices) {
            item.setIsDel(IsDel.DELETED.getValue());
            DataUtils.setDataAction(item, actionBy, false);
        }
        ticketPriceRepository.saveAll(ticketPrices);
        // xoá địa điểm sử dụng
        List<TicketLocation> ticketLocations = ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                optionalTicketWaitRelease.getTicketId(), TypeTicket.CHO_AP_DUNG.getValue(), IsDel.DELETE_NOT_YET.getValue());
        for (TicketLocation item : ticketLocations) {
            item.setIsDel(IsDel.DELETED.getValue());
            DataUtils.setDataAction(item, actionBy, false);
        }
        ticketLocationRepository.saveAll(ticketLocations);

        return ApiResponse.builder()
                .result(ticketMapper.toDataSearchTicketResponse(optionalTicketWaitRelease))
                .build();
    }

    @Override
    public ApiResponse<Object> detail(Long id) {
        boolean roleAdmin = false;
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!roleAdmin && !ticket.getPartnerId().equals(accountId)) {
            throw new AppException(ErrorCode.NO_ACCESS);
        }
        DataSearchTicketResponse result = ticketMapper.toDataSearchTicketResponse(ticket);
        // lấy thông tin giá vé
        Map<String, TicketPrice> ticketPriceMap = getMapTicketPrice(TypeTicket.PHAT_HANH.getValue(), List.of(ticket.getTicketId()));
        getTicketPriceResponse(ticketPriceMap, result);
        // lấy địa điểm áp dụng
        List<TicketLocation> ticketLocations = ticketLocationRepository
                .findAllByObjectIdAndTypeAndIsDel(ticket.getTicketId(),
                        TypeTicket.PHAT_HANH.getValue(), IsDel.DELETE_NOT_YET.getValue());
        List<Long> locationIds = ticketLocations.stream().map(TicketLocation::getLocationId).toList();
        result.setLocationUse(locationIds);
        return ApiResponse.builder()
                .result(result)
                .build();
    }

    @Override
    public ApiResponse<Object> detailWaitRelease(Long id) {
        return null;
    }

    @Override
    public ApiResponse<Object> adminSearch(SearchTicket request, Pageable pageable) {
        // search like
        String ticketName = DataUtils.convertStringSearchLike(request.getTicketName());
        String locationName = DataUtils.convertStringSearchLike(request.getLocationName());
        String partnerName = DataUtils.convertStringSearchLike(request.getPartnerName());
        // convert tab
        Integer status = null;
        Integer modifyStatus = request.getModifyStatus();
        switch (request.getTab()) {
            case 1 -> status = TicketStatus.CHO_PHAT_HANH;
            case 2 -> status = TicketStatus.DANG_PHAT_HANH;
            case 3 -> status = TicketStatus.TAM_DUNG_PHAT_HANH;
            case 4 -> {
                // bỏ qua nếu tab là từ chối/dừng phát hành
                break;
            }
            default -> throw new AppException(ErrorCode.INVALID_DATA);
        }
        // thời gian áp dụng
        LocalDateTime releaseTime = null;
        String trendReleaseTime = null;
        if (!DataUtils.isNullOrEmpty(request.getReleasedTime())) {
            // dữ liệu
            if (!DataUtils.isNullOrEmpty(request.getReleasedTime().getValue())) {
                String applyDateStr = (String) request.getReleasedTime().getValue();
                releaseTime = LocalDateTime.parse(applyDateStr);
            }
            // cách tìm kiếm kết quả
            if (!DataUtils.isNullOrEmpty(request.getReleasedTime().getTrend())) {
                trendReleaseTime = request.getReleasedTime().getTrend().toUpperCase(Locale.ROOT);
            }
        }
        // giá
        Long price = null;
        String trendPrice = null;
        if (!DataUtils.isNullOrEmpty(request.getPriceSearch())) {
            // dữ liệu
            if (!DataUtils.isNullOrEmpty(request.getPriceSearch().getValue())) {
                price = Long.parseLong(request.getPriceSearch().getValue().toString());
            }
            // cách tìm kiếm kết quả
            if (!DataUtils.isNullOrEmpty(request.getPriceSearch().getTrend())) {
                trendPrice = request.getPriceSearch().getTrend().toUpperCase(Locale.ROOT);
            }
        }
        // lấy type
        Integer typeTicket;
        if (request.getTab().equals(1) || request.getTab().equals(4)) {
            typeTicket = TypeTicket.CHO_AP_DUNG.getValue();
        } else {
            typeTicket = TypeTicket.PHAT_HANH.getValue();
        }
        List<String> listPartner = null;
        if (partnerName != null) {
            listPartner = accountRepository.findAccountIdByPartnerFullName(partnerName);
        }
        // lấy danh sách id nếu có giá
        List<Long> listIds = null;
        if (price != null) {
            listIds = ticketPriceRepository.findAllByTypeAndPriceCategoryAndPrice(typeTicket,
                    request.getPriceCategory(), price, trendPrice, listPartner);
        }
        // lấy danh sách id nếu có tên địa điểm
        List<Long> listIdWithLocation = null;
        if (locationName != null) {
            listIdWithLocation = locationRepository.findAllByNameAndPartnerId(locationName, listPartner);
            if (!listIdWithLocation.isEmpty()) {
                listIdWithLocation = ticketLocationRepository
                        .findByObjectIdAndTypeAndPartnerId(listIdWithLocation, typeTicket);
            }
        }
        // biến đổi danh sách id
        if (listIds != null && listIdWithLocation != null) {
            // lấy id chung nếu cả 2 đề có bản ghi
            listIds.retainAll(listIdWithLocation);
        } else if (listIds == null && listIdWithLocation != null) {
            // chuyển id lấy từ địa điểm nếu không tìm theo giá
            listIds = listIdWithLocation;
        }
        // không tìm theo đối tác nếu có tìm theo id
        if (listIds != null && !listIds.isEmpty()) {
            listPartner = null;
        }

        List<Long> ids;
        List<DataSearchTicketResponse> result;
        Long totalElement = null;
        Integer totalPage = null;
        if (request.getTab().equals(1) || request.getTab().equals(4)) {
            // lấy vé chờ phát hành
            Page<TicketWaitRelease> ticketWaitReleases = ticketWaitReleaseRepository.adminSearch(
                    ticketName,
                    modifyStatus,
                    releaseTime,
                    trendReleaseTime,
                    request.getVehicle(),
                    listIds,
                    listPartner,
                    request.getTab().equals(4),
                    pageable
            );
            // gán dữ liệu trang
            totalElement = ticketWaitReleases.getTotalElements();
            totalPage = ticketWaitReleases.getTotalPages();
            // map giá vé với bản ghi
            ids = ticketWaitReleases.stream().map(TicketWaitRelease::getId).toList();
            Map<String, TicketPrice> ticketPriceMap = getMapTicketPrice(typeTicket, ids);
            // chuyển thành kết quả trả về
            result = ticketWaitReleases.stream().map(item -> {
                DataSearchTicketResponse dataSearchTicketResponse = ticketMapper.toDataSearchTicketResponse(item);
                // chèn giá vào bản ghi
                getTicketPriceResponse(ticketPriceMap, dataSearchTicketResponse);
                return dataSearchTicketResponse;
            }).toList();
        } else {
            // lấy vé đã phát hành
            Page<Ticket> tickets = ticketRepository.adminSearch(
                    ticketName,
                    status,
                    modifyStatus,
                    releaseTime,
                    trendReleaseTime,
                    request.getVehicle(),
                    listIds,
                    listPartner,
                    pageable
            );
            // gán dữ liệu trang
            totalElement = tickets.getTotalElements();
            totalPage = tickets.getTotalPages();
            // map giá vé với bản ghi
            ids = tickets.stream().map(Ticket::getTicketId).toList();
            Map<String, TicketPrice> ticketPriceMap = getMapTicketPrice(typeTicket, ids);
            // chuyển thành kết quả trả về
            result = tickets.stream().map(item -> {
                DataSearchTicketResponse dataSearchTicketResponse = ticketMapper.toDataSearchTicketResponse(item);
                // chèn giá vào bản ghi
                getTicketPriceResponse(ticketPriceMap, dataSearchTicketResponse);
                return dataSearchTicketResponse;
            }).toList();
        }
        // lấy thông tin đối tác
        List<String> partnerId = result.stream().map(DataSearchTicketResponse::getPartnerId).toList();
        List<Account> partners = accountRepository.findAllById(partnerId);
        Map<String, Account> parntersMap = partners.stream().collect(Collectors.toMap(Account::getId, item -> item));
        // map thêm tên đối tác
        result.forEach(item -> item.setPartnerName(parntersMap.get(item.getPartnerId()).getPartnerFullName()));
        return ApiResponse.builder()
                .result(new PageResponse<>(result, totalPage, totalElement))
                .build();
    }

    @Override
    public ApiResponse<Object> partnerSearch(SearchTicket request, Pageable pageable) {
        String partnerId = ParkingServiceApplication.testPartnerActionBy;
        // search like
        String ticketName = DataUtils.convertStringSearchLike(request.getTicketName());
        String locationName = DataUtils.convertStringSearchLike(request.getLocationName());
        // convert tab
        Integer status = null;
        Integer modifyStatus = request.getModifyStatus();
        switch (request.getTab()) {
            case 1 -> status = TicketStatus.DANG_PHAT_HANH;
            case 2 -> status = TicketStatus.TAM_DUNG_PHAT_HANH;
            case 3 -> status = TicketStatus.CHO_PHAT_HANH;
            default -> throw new AppException(ErrorCode.INVALID_DATA);
        }
        // thời gian áp dụng
        LocalDateTime releaseTime = null;
        String trendReleaseTime = null;
        if (!DataUtils.isNullOrEmpty(request.getReleasedTime())) {
            // dữ liệu
            if (!DataUtils.isNullOrEmpty(request.getReleasedTime().getValue())) {
                String applyDateStr = (String) request.getReleasedTime().getValue();
                releaseTime = LocalDateTime.parse(applyDateStr);
            }
            // cách tìm kiếm kết quả
            if (!DataUtils.isNullOrEmpty(request.getReleasedTime().getTrend())) {
                trendReleaseTime = request.getReleasedTime().getTrend().toUpperCase(Locale.ROOT);
            }
        }
        // giá
        Long price = null;
        String trendPrice = null;
        if (!DataUtils.isNullOrEmpty(request.getPriceSearch())) {
            // dữ liệu
            if (!DataUtils.isNullOrEmpty(request.getPriceSearch().getValue())) {
                price = Long.parseLong(request.getPriceSearch().getValue().toString());
            }
            // cách tìm kiếm kết quả
            if (!DataUtils.isNullOrEmpty(request.getPriceSearch().getTrend())) {
                trendPrice = request.getPriceSearch().getTrend().toUpperCase(Locale.ROOT);
            }
        }
        // lấy type
        Integer typeTicket;
        if (request.getTab().equals(3)) {
            typeTicket = TypeTicket.CHO_AP_DUNG.getValue();
        } else {
            typeTicket = TypeTicket.PHAT_HANH.getValue();
        }
        // lấy danh sách id nếu có giá
        List<Long> listIds = null;
        if (price != null) {
            listIds = ticketPriceRepository.findAllByTypeAndPriceCategoryAndPrice(typeTicket,
                    request.getPriceCategory(), price, trendPrice, List.of(partnerId));
        }
        // lấy danh sách id nếu có tên địa điểm
        List<Long> listIdWithLocation = null;
        if (locationName != null) {
            listIdWithLocation = locationRepository.findAllByNameAndPartnerId(locationName, List.of(partnerId));
            if (!listIdWithLocation.isEmpty()) {
                listIdWithLocation = ticketLocationRepository
                        .findByObjectIdAndTypeAndPartnerId(listIdWithLocation, typeTicket);
            }
        }
        // biến đổi danh sách id
        if (listIds != null && listIdWithLocation != null) {
            // lấy id chung nếu cả 2 đề có bản ghi
            listIds.retainAll(listIdWithLocation);
        } else if (listIds == null && listIdWithLocation != null) {
            // chuyển id lấy từ địa điểm nếu không tìm theo giá
            listIds = listIdWithLocation;
        }

        List<Long> ids;
        List<DataSearchTicketResponse> result;
        Long totalElement = null;
        Integer totalPage = null;
        if (request.getTab().equals(3)) {
            // lấy vé chờ phát hành
            Page<TicketWaitRelease> ticketWaitReleases = ticketWaitReleaseRepository.partnerSearch(
                    ticketName,
                    modifyStatus,
                    releaseTime,
                    trendReleaseTime,
                    request.getVehicle(),
                    listIds,
                    partnerId,
                    pageable
            );
            // gán dữ liệu trang
            totalElement = ticketWaitReleases.getTotalElements();
            totalPage = ticketWaitReleases.getTotalPages();
            // map giá vé với bản ghi
            ids = ticketWaitReleases.stream().map(TicketWaitRelease::getId).toList();
            Map<String, TicketPrice> ticketPriceMap = getMapTicketPrice(typeTicket, ids);
            // chuyển thành kết quả trả về
            result = ticketWaitReleases.stream().map(item -> {
                DataSearchTicketResponse dataSearchTicketResponse = ticketMapper.toDataSearchTicketResponse(item);
                // chèn giá vào bản ghi
                getTicketPriceResponse(ticketPriceMap, dataSearchTicketResponse);
                return dataSearchTicketResponse;
            }).toList();
        } else {
            // lấy vé đã phát hành
            Page<Ticket> tickets = ticketRepository.partnerSearch(
                    ticketName,
                    status,
                    modifyStatus,
                    releaseTime,
                    trendReleaseTime,
                    request.getVehicle(),
                    listIds,
                    partnerId,
                    pageable
            );
            // gán dữ liệu trang
            totalElement = tickets.getTotalElements();
            totalPage = tickets.getTotalPages();
            // map giá vé với bản ghi
            ids = tickets.stream().map(Ticket::getTicketId).toList();
            Map<String, TicketPrice> ticketPriceMap = getMapTicketPrice(typeTicket, ids);
            // chuyển thành kết quả trả về
            result = tickets.stream().map(item -> {
                DataSearchTicketResponse dataSearchTicketResponse = ticketMapper.toDataSearchTicketResponse(item);
                // chèn giá vào bản ghi
                getTicketPriceResponse(ticketPriceMap, dataSearchTicketResponse);
                return dataSearchTicketResponse;
            }).toList();
        }

        return ApiResponse.builder()
                .result(new PageResponse<>(result, totalPage, totalElement))
                .build();
    }

    private void getTicketPriceResponse(Map<String, TicketPrice> ticketPriceMap, DataSearchTicketResponse dataSearchTicketResponse) {
        // lấy ra từ khoá đầu tiên của key
        Long keyPrefix;
        if (dataSearchTicketResponse.getId() != null) {
            keyPrefix = dataSearchTicketResponse.getId();
        } else {
            keyPrefix = dataSearchTicketResponse.getTicketId();
        }
        // kiểm tra và chèn giá trị
        PriceResponse priceResponse = new PriceResponse();
        if (dataSearchTicketResponse.isTimeSlot()) {
            TicketPrice ticketPrice = ticketPriceMap.get(keyPrefix + "-" + PriceCategory.TIME);
            priceResponse.setTime(ticketMapper.toTicketPriceResponse(ticketPrice));
        }
        if (dataSearchTicketResponse.isDaySlot()) {
            TicketPrice ticketPrice = ticketPriceMap.get(keyPrefix + "-" + PriceCategory.DAY);
            priceResponse.setDay(ticketMapper.toTicketPriceResponse(ticketPrice));
        }
        if (dataSearchTicketResponse.isWeekSlot()) {
            TicketPrice ticketPrice = ticketPriceMap.get(keyPrefix + "-" + PriceCategory.WEEK);
            priceResponse.setWeek(ticketMapper.toTicketPriceResponse(ticketPrice));
        }
        if (dataSearchTicketResponse.isMonthSlot()) {
            TicketPrice ticketPrice = ticketPriceMap.get(keyPrefix + "-" + PriceCategory.MONTH);
            priceResponse.setMonth(ticketMapper.toTicketPriceResponse(ticketPrice));
        }
        dataSearchTicketResponse.setPrice(priceResponse);
    }

    private Map<String, TicketPrice> getMapTicketPrice(Integer type, List<Long> objectIds) {
        // call lấy giá vé và chuyển thành dạng map
        List<TicketPrice> ticketPrices = ticketPriceRepository
                .findAllByObjectIdInAndTypeAndIsDel(objectIds, type, IsDel.DELETE_NOT_YET.getValue());
        return ticketPrices.stream().collect(
                Collectors.toMap(item -> item.getObjectId() + "-" + item.getPriceCategory(), item -> item));
    }

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
            ticketWaitRelease.setModifyCount(TicketModifyStatus.CHO_AP_DUNG);
            ticketWaitRelease.setStatus(TicketStatus.CHO_PHAT_HANH);
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
                    .partnerId(partnerId)
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
                        .partnerId(actionBy)
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
                        .partnerId(actionBy)
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
                        .partnerId(actionBy)
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
                        .partnerId(actionBy)
                        .isDel(IsDel.DELETE_NOT_YET.getValue())
                        .build();
                DataUtils.setDataAction(ticketPrice, actionBy, true);
                ticketPrices.add(ticketPrice);
            }
        }
        ticketPriceRepository.saveAll(ticketPrices);
    }
}
