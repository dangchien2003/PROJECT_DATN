package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.parking_service.dto.response.*;
import com.example.parking_service.entity.*;
import com.example.parking_service.enums.AccountCategory;
import com.example.parking_service.enums.LocationModifyStatus;
import com.example.parking_service.enums.PaymentType;
import com.example.parking_service.enums.TicketStatus;
import com.example.parking_service.mapper.LocationMapper;
import com.example.parking_service.mapper.LocationModifyMapper;
import com.example.parking_service.mapper.LocationWaitReleaseMapper;
import com.example.parking_service.mapper.PaymentMapper;
import com.example.parking_service.repository.*;
import com.example.parking_service.service.StatisticalService;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class StatisticalServiceImpl implements StatisticalService {
    LocationModifyRepository locationModifyRepository;
    TicketWaitReleaseRepository ticketWaitReleaseRepository;
    TicketPurchaseRepository ticketPurchaseRepository;
    PaymentRepository paymentRepository;
    AccountRepository accountRepository;
    TicketRepository ticketRepository;
    TicketLocationRepository ticketLocationRepository;
    OrderRepository orderRepository;
    LocationRepository locationRepository;
    //    LocationWaitReleaseRepository locationWaitReleaseRepository;
    PaymentMapper paymentMapper;
    LocationMapper locationMapper;
    LocationWaitReleaseMapper locationWaitReleaseMapper;
    LocationModifyMapper locationModifyMapper;

    @Override
    public ApiResponse<Object> getTicketOfCustomer(String accountId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        Page<TicketPurchasedResponse> dataPage = ticketPurchaseRepository.getAllByAccountId(accountId, pageQuery);
        Set<String> accountIds = new HashSet<>();
        dataPage.forEach(item -> {
            accountIds.add(item.getCreatedBy());
            accountIds.add(item.getSupplyId());
        });
        List<Account> accounts = accountRepository.findAllById(accountIds);
        // convertMap
        Map<String, Account> accountMap = accounts.stream().collect(Collectors.toMap(Account::getId, item -> item));
        // map data
        dataPage.forEach(item -> {
            item.setCreatedName(accountMap.get(item.getCreatedBy()).getFullName());
            item.setSupplier(accountMap.get(item.getSupplyId()).getPartnerFullName());
        });
        return ApiResponse.builder()
                .result(new PageResponse<>(dataPage.getContent(), dataPage.getTotalPages(), dataPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getTransactionOfCustomer(String accountId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        Page<Payment> dataPage = paymentRepository.findByPaymentBy(accountId, pageQuery);
        List<AdminTransactionHistoryResponse> result = dataPage.map(paymentMapper::toAdminTransactionHistoryResponse).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, dataPage.getTotalPages(), dataPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getTicketOfPartner(String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.MODIFIED_AT));
        Page<Ticket> ticketPage = ticketRepository.findByPartnerId(partnerId, pageQuery);
        List<StatisticalTicketOfPartner> result = ticketPage.stream().map(item ->
                StatisticalTicketOfPartner.builder()
                        .ticketId(item.getTicketId())
                        .name(item.getName())
                        .status(item.getStatus())
                        .vehicle(item.getVehicle())
                        .countLocationUse(item.getCountLocation())
                        .build()
        ).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, ticketPage.getTotalPages(), ticketPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getTicketWaitReleaseOfPartner(String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, TicketWaitRelease_.TIME_APPLIED_EDIT));
        Page<TicketWaitRelease> ticketPage = ticketWaitReleaseRepository.findByPartnerId(partnerId, pageQuery);
        List<StatisticalTicketWaitReleaseOfPartner> result = ticketPage.stream().map(item ->
                StatisticalTicketWaitReleaseOfPartner.builder()
                        .id(item.getId())
                        .ticketId(item.getTicketId())
                        .name(item.getName())
                        .modifyCount(item.getModifyCount())
                        .status(item.getStatus())
                        .releaseAt(item.getTimeAppliedEdit())
                        .vehicle(item.getVehicle())
                        .countLocationUse(item.getCountLocation())
                        .build()
        ).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, ticketPage.getTotalPages(), ticketPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getTicketPurchasedOfPartner(String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        Page<StatisticalTicketPurchasedOfPartner> orderPage = orderRepository.getListTicketPurchaseOfPartner(partnerId, pageQuery);
        //get location
        Set<Long> locationIds = orderPage.map(StatisticalTicketPurchasedOfPartner::getLocationId).toSet();
        List<LocationNameDTO> locationNameDTOS = locationRepository.getNameDto(locationIds);
        Map<Long, String> nameLocationMap = locationNameDTOS.stream().collect(Collectors.toMap(LocationNameDTO::getLocationId, LocationNameDTO::getName));
        orderPage.forEach(item -> {
            item.setLocationName(nameLocationMap.get(item.getLocationId()));
        });
        return ApiResponse.builder()
                .result(new PageResponse<>(orderPage.getContent(), orderPage.getTotalPages(), orderPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getLocationOfPartner(String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.MODIFIED_AT));
        Page<Location> locationPage = locationRepository.findByPartnerId(partnerId, pageQuery);
        List<StatisticalLocationOfPartner> result = locationPage.stream().map(locationMapper::toStatisticalLocationOfPartner).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, locationPage.getTotalPages(), locationPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getLocationWaitReleaseOfPartner(String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.MODIFIED_AT));
        Page<LocationModify> locationPage = locationModifyRepository.getLocationWaitReleaseOfPartner(partnerId, pageQuery);
        List<StatisticalLocationOfPartner> result = locationPage.stream().map(locationModifyMapper::toStatisticalLocationOfPartner).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, locationPage.getTotalPages(), locationPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getLocationWaitApproveOfPartner(String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.MODIFIED_AT));
        Page<LocationModify> locationPage = locationModifyRepository.getLocationWaitApproveOfPartner(partnerId, LocationModifyStatus.CHO_DUYET.getValue(), pageQuery);
        List<StatisticalLocationOfPartner> result = locationPage.stream().map(locationModifyMapper::toStatisticalLocationOfPartner).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, locationPage.getTotalPages(), locationPage.getTotalElements()))
                .build();
    }


    @Override
    public ApiResponse<Object> getStatisticalCardAtHomeByAdmin() {
        StatisticalCardAtHomeByAdminResponse response = StatisticalCardAtHomeByAdminResponse.builder()
                .doanhThu(this.thongKeDoanhThuTongQuanAdmin())
                .veDaBan(this.thongKeVeBanTongQuanAdmin())
                .soTienNap(this.thongKeSoTienNapTongQuanAdmin())
                .taiKhoan(this.thongKeTaiKhoanTongQuanAdmin())
                .veDaTao(this.thongKeVeDaTaoTongQuanAdmin())
                .diemDo(this.thongKeDiaDiemTongQuanAdmin())
                .build();
        return ApiResponse.builder()
                .result(response)
                .build();
    }

    List<ItemValueCard> thongKeDoanhThuTongQuanAdmin() {
        // tháng hiện tại
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(LocalTime.MAX);
        // tháng trước
        LocalDate prevMonthDate = now.minusMonths(1);
        LocalDateTime startOfPrevMonth = prevMonthDate.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfPrevMonth = prevMonthDate
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(LocalTime.MAX); // chính xác tới milli
        List<Integer> typeList = List.of(PaymentType.MUA_VE, PaymentType.GIA_HAN);
        // lấy dữ liệu
        Long doanhThuThang = paymentRepository.layDoanhThuThang(startOfMonth, endOfMonth, typeList);
        doanhThuThang = doanhThuThang == null ? 0 : doanhThuThang;
        Long doanhThuThangTruoc = paymentRepository.layDoanhThuThang(startOfPrevMonth, endOfPrevMonth, typeList);
        doanhThuThangTruoc = doanhThuThangTruoc == null ? 0 : doanhThuThangTruoc;
        return List.of(new ItemValueCard(doanhThuThang, doanhThuThang >= doanhThuThangTruoc));
    }

    List<ItemValueCard> thongKeVeBanTongQuanAdmin() {
        // tháng hiện tại
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(LocalTime.MAX);
        // tháng trước
        LocalDate prevMonthDate = now.minusMonths(1);
        LocalDateTime startOfPrevMonth = prevMonthDate.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfPrevMonth = prevMonthDate
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(LocalTime.MAX); // chính xác tới milli
        // lấy dữ liệu
        Long soVeBanDuocThangNay = ticketPurchaseRepository.layVeBanDuocTrongThang(startOfMonth, endOfMonth);
        soVeBanDuocThangNay = soVeBanDuocThangNay == null ? 0 : soVeBanDuocThangNay;
        Long soVeBanDuocThangTruoc = ticketPurchaseRepository.layVeBanDuocTrongThang(startOfPrevMonth, endOfPrevMonth);
        soVeBanDuocThangTruoc = soVeBanDuocThangTruoc == null ? 0 : soVeBanDuocThangTruoc;
        return List.of(new ItemValueCard(soVeBanDuocThangNay, soVeBanDuocThangNay >= soVeBanDuocThangTruoc));
    }

    List<ItemValueCard> thongKeSoTienNapTongQuanAdmin() {
        // tháng hiện tại
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(LocalTime.MAX);

        // lấy dữ liệu
        Long soVeBanDuocThangNay = paymentRepository.laySoTienThanhCongTheoType(startOfMonth, endOfMonth, PaymentType.NAP_TIEN);
        soVeBanDuocThangNay = soVeBanDuocThangNay == null ? 0 : soVeBanDuocThangNay;
        return List.of(new ItemValueCard(soVeBanDuocThangNay, null));
    }

    List<ItemValueCard> thongKeTaiKhoanTongQuanAdmin() {
        long customer = accountRepository.countByCategory(AccountCategory.KHACH_HANG.getValue());
        long partner = accountRepository.countByCategory(AccountCategory.DOI_TAC.getValue());
        return List.of(new ItemValueCard(customer, null), new ItemValueCard(partner, null));
    }

    List<ItemValueCard> thongKeVeDaTaoTongQuanAdmin() {
        long active = ticketRepository.countByStatus(TicketStatus.DANG_PHAT_HANH);
        long all = ticketRepository.count();
        return List.of(new ItemValueCard(active, null), new ItemValueCard(all, null));
    }

    List<ItemValueCard> thongKeDiaDiemTongQuanAdmin() {
        long active = locationRepository.countByStatus(TicketStatus.DANG_PHAT_HANH);
        long all = locationRepository.count();
        return List.of(new ItemValueCard(active, null), new ItemValueCard(all, null));
    }

    @Override
    public ApiResponse<Object> getStatisticalPieAtHomeByAdmin() {

        StatisticalPieAtHomeByAdminResponse response = StatisticalPieAtHomeByAdminResponse.builder()
                .ve(this.thongKeVeGiaHanKhongGiaHan())
                .soTienTheoMucDich(this.thongKeSoTienSuDung())
                .build();
        return ApiResponse.builder()
                .result(response)
                .build();
    }

    List<ItemValuePie> thongKeVeGiaHanKhongGiaHan() {
        // tháng hiện tại
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(LocalTime.MAX);

        Long veGiaHan = ticketPurchaseRepository.demSoLuongVeGiaHan(startOfMonth, endOfMonth);
        Long veKhongGiaHan = ticketPurchaseRepository.demSoLuongVeKhongGiaHan(startOfMonth, endOfMonth);
        List<ItemValuePie> resultVe = new ArrayList<>();
        resultVe.add(new ItemValuePie(veGiaHan, "Gia hạn"));
        resultVe.add(new ItemValuePie(veKhongGiaHan, "Không gia hạn"));
        return resultVe;
    }

    List<ItemValuePie> thongKeSoTienSuDung() {
        // tháng hiện tại
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now
                .with(TemporalAdjusters.lastDayOfMonth())
                .atTime(LocalTime.MAX);
        Long muaVe = paymentRepository.laySoTienThanhCongTheoType(startOfMonth, endOfMonth, PaymentType.MUA_VE);
        Long giaHanVe = paymentRepository.laySoTienThanhCongTheoType(startOfMonth, endOfMonth, PaymentType.GIA_HAN);
        Long napTien = paymentRepository.laySoTienThanhCongTheoType(startOfMonth, endOfMonth, PaymentType.NAP_TIEN);
        List<ItemValuePie> resultVe = new ArrayList<>();
        resultVe.add(new ItemValuePie(muaVe == null ? 0 : muaVe, "Mua vé"));
        resultVe.add(new ItemValuePie(giaHanVe == null ? 0 : giaHanVe, "Gia hạn"));
        resultVe.add(new ItemValuePie(napTien == null ? 0 : napTien, "Nạp tiền"));
        return resultVe;
    }

    @Override
    public ApiResponse<Object> getStatisticalAreaAtHomeByAdmin() {
        // tháng hiện tại
        LocalDate now = LocalDate.now();
        LocalDate startOfMonthDate = now.withDayOfMonth(1);
        LocalDate endOfMonthDate = now.with(TemporalAdjusters.lastDayOfMonth());

        LocalDateTime startOfMonth = startOfMonthDate.atStartOfDay();
        LocalDateTime endOfMonth = endOfMonthDate
                .atTime(LocalTime.MAX);
        List<Integer> typeList = List.of(PaymentType.MUA_VE, PaymentType.GIA_HAN);
        // lấy dữ liệu db
        List<DoanhThuMotNgay> result = paymentRepository.thongKeDoanhThuThang(startOfMonth, endOfMonth, typeList);
        // tạo TreeMap chứa tất cả ngày trong tháng, mặc định = 0
        Map<String, Object> map = new TreeMap<>();
        LocalDate cursor = startOfMonthDate;
        while (!cursor.isAfter(endOfMonthDate)) {
            map.put(cursor.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), 0L); // mặc định = 0
            cursor = cursor.plusDays(1);
        }
        // map dữ liệu vào template
        for (DoanhThuMotNgay dto : result) {
            map.put(dto.getNgay().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), dto.getDoanhThu());
        }

        return ApiResponse.builder()
                .result(new StatisticalAreaResponse(map.keySet().stream().toList(), map.values().stream().toList()))
                .build();
    }
}
