package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.dto.response.DetailTicketInOutResponse;
import com.example.parking_service.dto.response.TicketInOutByAccountResponse;
import com.example.parking_service.entity.TicketInOut;
import com.example.parking_service.repository.TicketInOutRepository;
import com.example.parking_service.service.TicketInOutService;
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

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class TicketInOutServiceImpl implements TicketInOutService {
    TicketInOutRepository ticketInOutRepository;

    @Override
    public ApiResponse<Object> historyByAccountId(String accountId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.Direction.DESC, "checkinAt");
        Page<TicketInOutByAccountResponse> dataPage = ticketInOutRepository.findByAccountId(accountId, pageQuery);
        return ApiResponse.builder()
                .result(new PageResponse<>(dataPage.getContent(), dataPage.getTotalPages(), dataPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> historyByLocation(Long locationId, String partnerId, Pageable pageable) {
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.Direction.DESC, "checkinAt");
        Page<TicketInOutByAccountResponse> dataPage = ticketInOutRepository.findByLocationId(locationId, partnerId, pageQuery);
        return ApiResponse.builder()
                .result(new PageResponse<>(dataPage.getContent(), dataPage.getTotalPages(), dataPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> detail(Long id) {
        return ApiResponse.builder()
                .result(ticketInOutRepository.detail(id).get())
                .build();
    }

    @Override
    public ApiResponse<Object> historyByTicket(String ticketPurchasedId, Pageable pageable) {
        String accountId = UserContextHolder.getContext().getUid();
        Pageable pageQuery = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.Direction.DESC, "checkinAt");
        Page<TicketInOut> dataPage = ticketInOutRepository.findByTicketId(ticketPurchasedId, accountId, pageQuery);
        List<DetailTicketInOutResponse> data = dataPage.stream().map(item -> DetailTicketInOutResponse.builder()
                .id(item.getId())
                .checkinAt(item.getCheckinAt())
                .checkoutAt(item.getCheckoutAt())
                .build()).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(data, dataPage.getTotalPages(), dataPage.getTotalElements()))
                .build();
    }
}
