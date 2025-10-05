package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.dto.request.SearchHistoryTransactionRequest;
import com.example.parking_service.dto.response.TransactionHistoryResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.entity.Payment;
import com.example.parking_service.mapper.PaymentMapper;
import com.example.parking_service.repository.AccountRepository;
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
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    private final AccountRepository accountRepository;
    PaymentRepository paymentRepository;
    PaymentMapper paymentMapper;

    @Override
    public ApiResponse<Object> getHistory(SearchHistoryTransactionRequest request, String paymentBy, Pageable pageable) {
        Pageable pageableQuery = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
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
                paymentBy,
                pageableQuery
        );
        Map<String, String> paymentByMap;
        if (paymentBy == null) {
            Set<String> paymentByList = paymentPage.stream().map(item -> item.getPaymentBy()).collect(Collectors.toSet());
            List<Account> accounts = accountRepository.findAllById(paymentByList);
            paymentByMap = accounts.stream().collect(Collectors.toMap(Account::getId, Account::getFullName));
        } else {
            paymentByMap = null;
        }
        List<TransactionHistoryResponse> result = paymentPage.map(item -> {
            TransactionHistoryResponse response = paymentMapper.toCusTransactionHistoryResponse(item);
            if (paymentBy == null) {
                response.setPaymentPersonName(paymentByMap.get(item.getPaymentBy()));
            }
            return response;
        }).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, paymentPage.getTotalPages(), paymentPage.getTotalElements()))
                .build();
    }


    @Override
    public ApiResponse<Object> partnergetHistory(SearchHistoryTransactionRequest request, Pageable pageable) {
        String partnerId = UserContextHolder.getContext().getUid();
        Pageable pageableQuery = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "created_at"));
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
        Page<Payment> paymentPage = paymentRepository.partnerSearch(
                partnerId,
                request.getType(),
                transactionDateFrom,
                transactionDateTo,
                pageableQuery
        );
        List<TransactionHistoryResponse> result = paymentPage.map(item -> {
            TransactionHistoryResponse response = paymentMapper.toCusTransactionHistoryResponse(item);
            return response;
        }).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, paymentPage.getTotalPages(), paymentPage.getTotalElements()))
                .build();
    }
}
