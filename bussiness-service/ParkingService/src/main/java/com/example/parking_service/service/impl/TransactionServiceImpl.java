package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.CusSearchHistoryTransactionRequest;
import com.example.parking_service.dto.response.CusTransactionHistoryResponse;
import com.example.parking_service.entity.Payment;
import com.example.parking_service.mapper.PaymentMapper;
import com.example.parking_service.repository.PaymentRepository;
import com.example.parking_service.service.TransactionService;
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
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    PaymentRepository paymentRepository;
    PaymentMapper paymentMapper;

    @Override
    public ApiResponse<Object> customerGetHistory(CusSearchHistoryTransactionRequest request, Pageable pageable) {
        Pageable pageableQuery = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        LocalDateTime transactionDateFrom = null;
        LocalDateTime transactionDateTo = null;
        if (request.getTransactionDate() != null && !request.getTransactionDate().isEmpty()) {
            transactionDateFrom = request.getTransactionDate().getFirst()
                    .toLocalDate().atStartOfDay();
            if (request.getTransactionDate().size() == 2) {
                transactionDateTo = request.getTransactionDate().get(1)
                        .toLocalDate().atStartOfDay()
                        .plusHours(24).minus(1, ChronoUnit.MILLIS);
            }
        }
        Page<Payment> paymentPage = paymentRepository.customerSearch(
                request.getType(),
                transactionDateFrom,
                transactionDateTo,
                accountId,
                pageableQuery
        );
        List<CusTransactionHistoryResponse> result = paymentPage.map(paymentMapper::toCusTransactionHistoryResponse).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, paymentPage.getTotalPages(), paymentPage.getTotalElements()))
                .build();
    }
}
