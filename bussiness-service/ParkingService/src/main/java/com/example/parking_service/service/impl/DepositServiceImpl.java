package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.AddDepositRequest;
import com.example.parking_service.dto.response.DepositHistoryResponse;
import com.example.parking_service.dto.response.PayOnlineResponse;
import com.example.parking_service.entity.Deposit;
import com.example.parking_service.entity.Deposit_;
import com.example.parking_service.entity.Payment;
import com.example.parking_service.enums.*;
import com.example.parking_service.mapper.DepositMapper;
import com.example.parking_service.repository.DepositRepository;
import com.example.parking_service.repository.PaymentRepository;
import com.example.parking_service.service.DepositService;
import com.example.parking_service.service.VnPayService;
import com.example.parking_service.utils.HttpUtils;
import jakarta.servlet.http.HttpServletRequest;
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

import java.io.UnsupportedEncodingException;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class DepositServiceImpl implements DepositService {
    DepositRepository depositRepository;
    PaymentRepository paymentRepository;
    VnPayService vnPayService;
    DepositMapper depositMapper;

    @Override
    public ApiResponse<Object> requestDeposit(AddDepositRequest request, HttpServletRequest http) throws UnsupportedEncodingException {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        // validate
        if (request.getTotal() <= 0) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Số tiền nạp phải lớn hơn 0"));
        }
        if (!request.getPaymentMethod().equals(PaymentMethod.BANKING) && !request.getPaymentMethod().equals(PaymentMethod.VNPAY)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Phương thức thanh toán không hợp lệ"));
        }
        // kiểm tra số yêu cầu đang xử lý
        int countRequestPending = depositRepository.countByAccountIdAndStatus(accountId, DepositStatus.CHO_THANH_TOAN);
        if (countRequestPending > 3) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Đã vượt quá số lượt yêu cầu. Vui lòng thanh toán yêu cầu đã tạo"));
        }
        Deposit deposit = Deposit.builder()
                .accountId(accountId)
                .status(DepositStatus.CHO_THANH_TOAN)
                .total(request.getTotal())
                .paymentMethod(request.getPaymentMethod())
                .build();
        DataUtils.setDataAction(deposit, accountId, true);
        // lưu yêu cầu nạp tiền
        deposit = depositRepository.save(deposit);
        // thêm yêu cầu thanh toán
        Payment payment = addPayment(deposit);
        // lấy url thanh toán
        PayOnlineResponse response = null;
        if (request.getPaymentMethod().equals(PaymentMethod.VNPAY)) {
            response = vnPayService.generateUrl(payment.getPaymentId(), payment.getTotal(), HttpUtils.getClientIp(http), "nạp tiền", UrlReturn.getDepositUrl());
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Phương thức thanh toán chưa hỗ trợ"));
        }
        return ApiResponse.builder()
                .result(response)
                .build();
    }

    Payment addPayment(Deposit deposit) {
        Payment payment = Payment.builder()
                .objectId(deposit.getId().toString())
                .paymentBy(deposit.getAccountId())
                .status(PaymentStatus.CHO_THANH_TOAN)
                .type(PaymentType.NAP_TIEN)
                .paymentMethod(deposit.getPaymentMethod())
                .fluctuation(Fluctuation.TANG)
                .total(deposit.getTotal())
                .build();
        DataUtils.setDataAction(payment, deposit.getAccountId(), true);
        return paymentRepository.save(payment);
    }

    @Override
    public ApiResponse<Object> getHistory(Pageable pageable) {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        Pageable pageQuery = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, Deposit_.CREATED_AT));
        Page<Deposit> depositPage = depositRepository.findByAccountId(accountId, pageQuery);
        List<DepositHistoryResponse> result = depositPage.map(depositMapper::toDepositHistoryResponse).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, depositPage.getTotalPages(), depositPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> cancelRequest(Long id) {
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        Deposit deposit = depositRepository.findByIdAndAccountId(id, accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy yêu cầu")));
        // kiểm tra trạng thái
        if (!deposit.getStatus().equals(DepositStatus.CHO_THANH_TOAN)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể hủy yêu cầu đã xử lý"));
        }
        // cập nhật trạng thái yêu cầu
        deposit.setStatus(DepositStatus.HUY_YEU_CAU);
        DataUtils.setDataAction(deposit, accountId, false);
        // cập nật trạng thái giao dịch
        Payment payment = paymentRepository.findByObjectIdAndType(deposit.getId().toString(), PaymentType.NAP_TIEN)
                .orElse(null);
        if (payment != null) {
            payment.setStatus(PaymentStatus.HUY_GIAO_DICH);
            payment.setReasonFail("Khách hàng yêu cầu hủy");
            DataUtils.setDataAction(payment, accountId, false);
            paymentRepository.save(payment);
        }
        return ApiResponse.builder().build();
    }
}
