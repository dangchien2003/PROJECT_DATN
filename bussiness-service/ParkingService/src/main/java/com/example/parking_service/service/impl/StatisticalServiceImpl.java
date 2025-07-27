package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.parking_service.dto.response.*;
import com.example.parking_service.entity.*;
import com.example.parking_service.enums.LocationModifyStatus;
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

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
}
