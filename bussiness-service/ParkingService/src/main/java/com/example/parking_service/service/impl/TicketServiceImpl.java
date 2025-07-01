package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.enums.IsDel;
import com.example.common.enums.Release;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.TimeUtil;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.Specification.TicketSpecification;
import com.example.parking_service.Specification.TicketWaitReleaseSpecification;
import com.example.parking_service.dto.other.ScheduledJob;
import com.example.parking_service.dto.other.ScheduledJobId;
import com.example.parking_service.dto.request.ApproveRequest;
import com.example.parking_service.dto.request.CustomerSearchTicket;
import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.dto.request.SearchTicket;
import com.example.parking_service.dto.response.CustomerSearchLocationResponse;
import com.example.parking_service.dto.response.CustomerTicketResponse;
import com.example.parking_service.dto.response.DataSearchTicketResponse;
import com.example.parking_service.dto.response.SearchTicketResponse;
import com.example.parking_service.entity.*;
import com.example.parking_service.enums.*;
import com.example.parking_service.mapper.TicketMapper;
import com.example.parking_service.mapper.TicketWaitReleaseMapper;
import com.example.parking_service.repository.*;
import com.example.parking_service.service.SchedulerService;
import com.example.parking_service.service.TicketService;
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
    TicketLocationRepository ticketLocationRepository;
    TicketWaitReleaseRepository ticketWaitReleaseRepository;
    TicketSpecification ticketSpecification;
    TicketWaitReleaseSpecification ticketWaitReleaseSpecification;
    SchedulerService schedulerService;
    TicketMapper ticketMapper;
    TicketWaitReleaseMapper ticketWaitReleaseMapper;
    ObjectMapper objectMapper;

    @Override
    public void checkExistWaitRelease(Long ticketId) {
        // kiểm tra có tồn tại bản ghi chờ áp dụng hay không
        if (ticketWaitReleaseRepository.existsByTicketIdAndIsDelAndReleased(ticketId,
                IsDel.DELETE_NOT_YET.getValue(), Release.RELEASE_NOT_YET.getValue())) {
            throw new AppException(ErrorCode.CONFLICT_DATA.withMessage("Đang tồn tại bản ghi chờ áp dụng, tiến hành huỷ để tiếp tục"));
        }
    }

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
        boolean roleAdmin = true;
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!roleAdmin && !ticket.getPartnerId().equals(accountId)) {
            throw new AppException(ErrorCode.NO_ACCESS);
        }
        DataSearchTicketResponse result = ticketMapper.toDataSearchTicketResponse(ticket);
        // lấy địa điểm áp dụng
        List<TicketLocation> ticketLocations = ticketLocationRepository
                .findAllByObjectIdAndTypeAndIsDel(ticket.getTicketId(),
                        TypeTicket.PHAT_HANH.getValue(), IsDel.DELETE_NOT_YET.getValue());
        List<Long> locationIds = ticketLocations.stream().map(TicketLocation::getLocationId).toList();
        result.setLocationUse(locationIds);
        if (roleAdmin) {
            Account account = accountRepository.findById(result.getPartnerId())
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            result.setPartnerName(account.getPartnerFullName());
        }
        return ApiResponse.builder()
                .result(result)
                .build();
    }

    @Override
    public ApiResponse<Object> detailWaitRelease(Long id) {
        boolean roleAdmin = true;
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        TicketWaitRelease ticketWaitRelease = ticketWaitReleaseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!roleAdmin && !ticketWaitRelease.getPartnerId().equals(accountId)) {
            throw new AppException(ErrorCode.NO_ACCESS);
        }
        DataSearchTicketResponse result = ticketMapper.toDataSearchTicketResponse(ticketWaitRelease);
        // lấy địa điểm áp dụng
        List<TicketLocation> ticketLocations = ticketLocationRepository
                .findAllByObjectIdAndTypeAndIsDel(ticketWaitRelease.getId(),
                        TypeTicket.CHO_AP_DUNG.getValue(), IsDel.DELETE_NOT_YET.getValue());
        List<Long> locationIds = ticketLocations.stream().map(TicketLocation::getLocationId).toList();
        result.setLocationUse(locationIds);
        if (roleAdmin) {
            Account account = accountRepository.findById(result.getPartnerId())
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
            result.setPartnerName(account.getPartnerFullName());
        }
        return ApiResponse.builder()
                .result(result)
                .build();
    }

    @Override
    public ApiResponse<Object> customerDetail(Long id) {
        if (id == null) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không xác định"));
        }
        // lấy dữ liệu
        List<Integer> statusReturn = List.of(TicketStatus.DANG_PHAT_HANH, TicketStatus.CHO_PHAT_HANH);
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);
        // kiểm tra trạng thái
        if (optionalTicket.isEmpty()
                || !statusReturn.contains(optionalTicket.get().getStatus())) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        Ticket ticket = optionalTicket.get();
        // convert response
        CustomerTicketResponse response = ticketMapper.toCustomerTicketResponse(ticket);
        return ApiResponse.builder()
                .result(response)
                .build();
    }

    @Override
    public ApiResponse<Object> locationUseTicket(Long id, Pageable pageable) {
        if (id == null) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Dữ liệu không xác định"));
        }
        // kiểm tra sự tồn tại của vé
        List<Integer> statusReturn = List.of(TicketStatus.DANG_PHAT_HANH, TicketStatus.CHO_PHAT_HANH);
        boolean existTicket = ticketRepository.existsByTicketIdAndStatusIn(id, statusReturn);
        if (!existTicket) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        // lấy địa điểm
        List<TicketLocation> ticketLocations = ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                id, TypeTicket.PHAT_HANH.getValue(), IsDel.DELETE_NOT_YET.getValue());
        // tách id địa điểm
        List<Long> locationIds = ticketLocations.stream().map(item -> item.getLocationId()).toList();
        // lấy đầy đủ thông tin địa điểm
        List<Integer> locationStatusReturn = List.of(
                LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue(),
                LocationStatus.CHO_DUYET.getValue());

        Pageable pageableQuery = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.ASC, Location_.NAME)
        );
        Page<Location> locations = locationRepository.findByLocationIdInAndStatusIn(locationIds, locationStatusReturn, pageableQuery);
        // địa điểm
        List<CustomerSearchLocationResponse> locationResponses = locations.stream().map(
                item -> CustomerSearchLocationResponse.builder()
                        .locationId(item.getLocationId())
                        .name(item.getName())
                        .address(item.getAddress())
                        .coordinatesX(item.getCoordinatesX())
                        .coordinatesY(item.getCoordinatesY())
                        .linkGoogleMap(item.getLinkGoogleMap())
                        .build()
        ).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(locationResponses, locations.getTotalPages(), locations.getTotalElements()))
                .build();
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
        if (!DataUtils.isNullOrEmpty(partnerName)) {
            listPartner = accountRepository.findAccountIdByPartnerFullName(partnerName);
        }
        // lấy danh sách id nếu có tên địa điểm
        List<Long> listIdWithLocation = null;
        List<Long> listLocationId = null;
        if (!DataUtils.isNullOrEmpty(locationName)) {
            listLocationId = locationRepository.findAllByNameAndPartnerId(locationName, listPartner);
            if (!listLocationId.isEmpty()) {
                listIdWithLocation = ticketLocationRepository
                        .findByLocationIdsAndType(listIdWithLocation, typeTicket);
            }
        }

        // không tìm theo đối tác nếu có tìm theo tên địa điểm
        if (listIdWithLocation != null && !listIdWithLocation.isEmpty()) {
            listPartner = null;
        }

        List<Long> ids;
        List<DataSearchTicketResponse> result;
        Long totalElement = null;
        Integer totalPage = null;
        if (request.getTab().equals(1) || request.getTab().equals(4)) {
            pageable = DataUtils.convertPageable(pageable, TicketWaitRelease_.ID);
            Specification<TicketWaitRelease> spec = ticketWaitReleaseSpecification.adminSearch(
                    ticketName,
                    modifyStatus,
                    releaseTime,
                    trendReleaseTime,
                    request.getVehicle(),
                    listIdWithLocation,
                    listPartner,
                    price,
                    trendPrice,
                    request.getPriceCategory(),
                    request.getTab().equals(4)
            );

            // lấy vé chờ phát hành
            Page<TicketWaitRelease> ticketWaitReleases = ticketWaitReleaseRepository.findAll(spec, pageable);
            // gán dữ liệu trang
            totalElement = ticketWaitReleases.getTotalElements();
            totalPage = ticketWaitReleases.getTotalPages();
            // chuyển thành kết quả trả về
            result = ticketWaitReleases.stream().map(ticketMapper::toDataSearchTicketResponse).toList();
        } else {
            pageable = DataUtils.convertPageable(pageable, Ticket_.TICKET_ID);
            Specification<Ticket> spec = ticketSpecification.adminSearch(
                    ticketName,
                    status,
                    modifyStatus,
                    releaseTime,
                    trendReleaseTime,
                    request.getVehicle(),
                    listIdWithLocation,
                    listPartner,
                    price,
                    trendPrice,
                    request.getPriceCategory()
            );

            // lấy vé đã phát hành
            Page<Ticket> tickets = ticketRepository.findAll(spec, pageable);
            // gán dữ liệu trang
            totalElement = tickets.getTotalElements();
            totalPage = tickets.getTotalPages();
            // chuyển thành kết quả trả về
            result = tickets.stream().map(ticketMapper::toDataSearchTicketResponse).toList();
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
        // lấy danh sách id nếu có tên địa điểm
        List<Long> listIdWithLocation = null;
        if (locationName != null) {
            listIdWithLocation = locationRepository.findAllByNameAndPartnerId(locationName, List.of(partnerId));
            if (!listIdWithLocation.isEmpty()) {
                listIdWithLocation = ticketLocationRepository
                        .findByLocationIdsAndType(listIdWithLocation, typeTicket);
            }
        }

        List<Long> ids;
        List<DataSearchTicketResponse> result;
        Long totalElement = null;
        Integer totalPage = null;
        if (request.getTab().equals(3)) {
            pageable = DataUtils.convertPageable(pageable, TicketWaitRelease_.ID);
            Specification<TicketWaitRelease> spec = ticketWaitReleaseSpecification.partnerSearch(
                    ticketName,
                    modifyStatus,
                    releaseTime,
                    trendReleaseTime,
                    request.getVehicle(),
                    listIdWithLocation,
                    partnerId,
                    price,
                    trendPrice,
                    request.getPriceCategory()
            );
            Page<TicketWaitRelease> ticketWaitReleases = ticketWaitReleaseRepository.findAll(spec, pageable);
            // gán dữ liệu trang
            totalElement = ticketWaitReleases.getTotalElements();
            totalPage = ticketWaitReleases.getTotalPages();
            // chuyển thành kết quả trả về
            result = ticketWaitReleases.stream().map(ticketMapper::toDataSearchTicketResponse).toList();
        } else {
            pageable = DataUtils.convertPageable(pageable, Ticket_.TICKET_ID);
            Specification<Ticket> spec = ticketSpecification.partnerSearch(
                    ticketName,
                    status,
                    modifyStatus,
                    releaseTime,
                    trendReleaseTime,
                    request.getVehicle(),
                    listIdWithLocation,
                    partnerId,
                    price,
                    trendPrice,
                    request.getPriceCategory()
            );
            Page<Ticket> tickets = ticketRepository.findAll(spec, pageable);
            // gán dữ liệu trang
            totalElement = tickets.getTotalElements();
            totalPage = tickets.getTotalPages();
            // chuyển thành kết quả trả về
            result = tickets.stream().map(ticketMapper::toDataSearchTicketResponse).toList();
        }

        return ApiResponse.builder()
                .result(new PageResponse<>(result, totalPage, totalElement))
                .build();
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
            ticketWaitRelease.setCountLocation(request.getLocationUse().size());
            DataUtils.setDataAction(ticketWaitRelease, partnerId, true);
            ticketWaitRelease = ticketWaitReleaseRepository.save(ticketWaitRelease);
            // lưu địa điểm
            saveLocationUse(request, ticketWaitRelease, partnerId);
        } else {
            // kiểm tra tồn tại bản ghi chờ phát hành
            this.checkExistWaitRelease(ticket.getTicketId());
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
            ticketWaitRelease.setCountLocation(request.getLocationUse().size());
            DataUtils.setDataAction(ticketWaitRelease, partnerId, true);
            // lưu bản ghi
            ticketWaitRelease = ticketWaitReleaseRepository.save(ticketWaitRelease);
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

    @Override
    public void loadScheduler() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime from = TimeUtil.getStartOfCurrentHour();
        if (now.getMinute() >= 30) {
            from = from.plusMinutes(30);
        }
        LocalDateTime to = from.plusMinutes(30);
        List<TicketWaitRelease> entityList = ticketWaitReleaseRepository
                .findAllRecordWaitRelease(from, to, IsDel.DELETE_NOT_YET.getValue(), Release.RELEASE_NOT_YET.getValue());
        for (TicketWaitRelease ticketWaitRelease : entityList) {
            insertScheduler(ticketWaitRelease);
        }
    }

    private void insertScheduler(TicketWaitRelease ticketWaitRelease) {
        String actionBy = "scheduler";
        if (ticketWaitRelease.getTimeAppliedEdit().isAfter(TimeUtil.getStartOfNextHour())) {
            return;
        }
        // lệnh sẽ chạy khi tới thời điểm
        Runnable runnable = () -> {
            try {
                executeApplyLocation(ticketWaitRelease, actionBy);
            } catch (Exception e) {
                log.error("Error: ", e);
            }
        };
        ScheduledJob scheduledJob = ScheduledJob.builder()
                .scheduledJobId(new ScheduledJobId(ModuleName.TICKET, ticketWaitRelease.getId().toString()))
                .task(runnable)
                .runAt(ticketWaitRelease.getTimeAppliedEdit())
                .build();
        schedulerService.addTask(scheduledJob);
    }

    public void executeApplyLocation(TicketWaitRelease ticketWaitRelease, String actionBy) throws JsonProcessingException {
        String beforeUpdate = objectMapper.writeValueAsString(ticketWaitRelease);
        // thay đổi entity release
        ticketWaitRelease.setStatus(TicketStatus.DANG_PHAT_HANH);
        ticketWaitRelease.setReleased(Release.RELEASE.getValue());
        ticketWaitRelease.setReleaseAt(LocalDateTime.now());
        DataUtils.setDataAction(ticketWaitRelease, actionBy, false);
        // lưu
        ticketWaitReleaseRepository.save(ticketWaitRelease);

        try {
            // thay thế bản ghi phát hành
            Ticket ticket;
            if (!DataUtils.isNullOrEmpty(ticketWaitRelease.getTicketId())) {
                ticket = ticketRepository.findById(ticketWaitRelease.getTicketId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy địa điểm có id: " + ticketWaitRelease.getTicketId())));
            } else {
                ticket = new Ticket();
            }

            // map dữ liệu
            ticketMapper.toTicketFromReleaseEntity(ticket, ticketWaitRelease);
            ticket.setModifyStatus(LocationModifyStatus.DA_AP_DUNG.getValue());
            // set lai thơi gian phát hành khi tạo mới hoặc phát hành lại
            if (ticket.getTicketId() == null
                    || (ticket.getStatus().equals(TicketStatus.TAM_DUNG_PHAT_HANH) && ticketWaitRelease.getStatus().equals(TicketStatus.DANG_PHAT_HANH))) {
                ticket.setReleasedTime(LocalDateTime.now());
                ticket.setStatus(TicketStatus.DANG_PHAT_HANH);
            }
            // thay đổi thời gian tác động
            DataUtils.setDataAction(ticket, actionBy, DataUtils.isNullOrEmpty(ticketWaitRelease.getTicketId()));
            // lưu dữ liệu
            ticket = ticketRepository.save(ticket);
            // update đia điểm sử dụng
            List<TicketLocation> ticketLocations = ticketLocationRepository
                    .findAllByObjectIdAndTypeAndIsDel(ticketWaitRelease.getId(), TypeTicket.CHO_AP_DUNG.getValue(), IsDel.DELETE_NOT_YET.getValue());
            for (TicketLocation ticketLocation : ticketLocations) {
                ticketLocation.setId(null);
                ticketLocation.setObjectId(ticket.getTicketId());
                ticketLocation.setType(TypeTicket.PHAT_HANH.getValue());
                DataUtils.setDataAction(ticketLocation, "schedule", true);
            }
            ticketLocationRepository.saveAll(ticketLocations);
        } catch (Exception e) {
            log.error("error: ", e);
            // rollback nếu lỗi
            try {
                TicketWaitRelease ticketWaitReleaseRollback = objectMapper.readValue(beforeUpdate, TicketWaitRelease.class);
                ticketWaitReleaseRepository.save(ticketWaitReleaseRollback);
            } catch (JsonProcessingException ex) {
                log.error("error: ", ex);
                log.error("lỗi rollback dữ liệu(LocationWaitRelease): " + beforeUpdate);
            }
        }
    }

    @Override
    public ApiResponse<Object> search(CustomerSearchTicket request, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.ASC, Ticket_.NAME));
        if (request.getLocationId() == null) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không tìm thấy địa điểm"));
        }
        if (request.getTicketCategory() != null && !PriceCategory.ALL_CATEGORY.contains(request.getTicketCategory())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Loại vé không phù hợp"));
        }
        List<Long> ticketIds = ticketLocationRepository.findByLocationIdsAndType(List.of(request.getLocationId()), TypeTicket.PHAT_HANH.getValue());
        // khi khng tìm thấy vé nào
        if (ticketIds.isEmpty()) {
            return ApiResponse.builder()
                    .result(new PageResponse<>(new ArrayList<>(), 0, 0))
                    .build();
        }
        Specification<Ticket> specification = ticketSpecification.search(request.getVehicle(), request.getTicketCategory(), ticketIds);
        // Lấy thông tin vé
        Page<Ticket> tickets = ticketRepository.findAll(specification, pageQuery);
        List<SearchTicketResponse> result = tickets.map(ticketMapper::toSearchTicketResponse).stream().toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, tickets.getTotalPages(), tickets.getTotalElements()))
                .build();
    }
}
