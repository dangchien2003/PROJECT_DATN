package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.enums.IsDel;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.ConfirmOrderRequest;
import com.example.parking_service.dto.request.CreateOrderRequest;
import com.example.parking_service.dto.response.CreateOrderResponse;
import com.example.parking_service.entity.*;
import com.example.parking_service.enums.*;
import com.example.parking_service.repository.*;
import com.example.parking_service.service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class OrderServiceImpl implements OrderService {
    TicketRepository ticketRepository;
    TicketLocationRepository ticketLocationRepository;
    LocationRepository locationRepository;
    AccountRepository accountRepository;
    OrderRepository orderRepository;
    PaymentRepository paymentRepository;
    TicketPurchasedRepository ticketPurchasedRepository;
    ObjectMapper objectMapper;

    @Override
    public ApiResponse<Object> order(CreateOrderRequest request) throws JsonProcessingException {
        String actionBy = ParkingServiceApplication.testPartnerActionBy;
        validateOrderRequest(request);
        validateValue(request);
        // validate tồn tại vé và địa điểm
        List<Integer> statusQuery = List.of(TicketStatus.DANG_PHAT_HANH, TicketStatus.CHO_PHAT_HANH);
        Ticket ticket = ticketRepository.findByTicketIdAndStatusIn(request.getTicketId(), statusQuery)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy vé đã chọn")));
        Location location = locationRepository.findByLocationIdAndStatus(
                        request.getLocationId(), LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy địa điểm đã chọn")));
        if (Boolean.FALSE.equals(ticketLocationRepository.existsByObjectIdAndLocationIdAndTypeAndIsDel(
                ticket.getTicketId(), location.getLocationId(), TypeTicket.PHAT_HANH.getValue(), IsDel.DELETE_NOT_YET.getValue()))) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Địa điểm không được hỗ trợ"));
        }
        // kiểm tra người được sở hữu nếu mua hộ
        String ownersJson = null;
        if (!DataUtils.isNullOrEmpty(request.getHelpBuy())) {
            int accountExist = accountRepository.countByIdInAndStatusAndPublicAccount(request.getHelpBuy(), AccountStatus.DANG_HOAT_DONG.getValue(), PublicAccount.PUBLIC);
            if (accountExist != request.getHelpBuy().size()) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Tồn tại tài khoản hưởng thụ không xác định"));
            }
            ownersJson = objectMapper.writeValueAsString(request.getHelpBuy());
        }

        // tính giá tiền
        Long priceUnit = null;
        if (request.getTicketCategory().equals(PriceCategory.TIME) && ticket.getPriceTimeSlot() != null) {
            priceUnit = ticket.getPriceTimeSlot();
        } else if (request.getTicketCategory().equals(PriceCategory.DAY) && ticket.getPriceDaySlot() != null) {
            priceUnit = ticket.getPriceDaySlot();
        } else if (request.getTicketCategory().equals(PriceCategory.WEEK) && ticket.getPriceWeekSlot() != null) {
            priceUnit = ticket.getPriceWeekSlot();
        } else if (request.getTicketCategory().equals(PriceCategory.MONTH) && ticket.getPriceMonthSlot() != null) {
            priceUnit = ticket.getPriceMonthSlot();
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Loại vé không hỗ trợ"));
        }
        long total = priceUnit * request.getQuality();
        if (!DataUtils.isNullOrEmpty(request.getHelpBuy())) {
            total = total * request.getHelpBuy().size();
        }

        // hạn cuối
        LocalDateTime expire = request.getStartTime().plus(request.getQuality(), getTimeUnit(request.getTicketCategory()));
        // lưu order
        OrderParking order = OrderParking.builder()
                .extendTicketId(request.getExtendTicketId())
                .total(total)
                .status(OrderStatus.CHO_XAC_NHAN)
                .qualityTicket(!DataUtils.isNullOrEmpty(request.getHelpBuy()) ? request.getHelpBuy().size() : 1)
                .owners(ownersJson)
                .locationId(location.getLocationId())
                .ticketId(ticket.getTicketId())
                .price(priceUnit)
                .ticketCategory(request.getTicketCategory())
                .quality(request.getQuality())
                .start(request.getStartTime())
                .expire(expire)
                .paymentBy(actionBy)
                .build();
        DataUtils.setDataAction(order, actionBy, true);
        order = orderRepository.save(order);
        // lấy thông tin người thanh toán
        Account account = accountRepository.findById(actionBy)
                .orElseThrow(() -> new AppException(ErrorCode.NO_ACCESS));
        CreateOrderResponse response = CreateOrderResponse.builder()
                .orderId(order.getOrderId())
                .createdAt(order.getCreatedAt())
                .personPaymentName(account.getFullName())
                .email(account.getEmail())
                .startTime(order.getStart())
                .expire(order.getExpire())
                .qualityTicket(order.getQualityTicket())
                .priceUnit(priceUnit)
                .total(total)
                .build();
        return ApiResponse.builder()
                .result(response)
                .build();
    }


    ChronoUnit getTimeUnit(Integer ticketCategory) {
        if (ticketCategory.equals(PriceCategory.TIME)) {
            return ChronoUnit.HOURS;
        } else if (ticketCategory.equals(PriceCategory.DAY)) {
            return ChronoUnit.DAYS;
        } else if (ticketCategory.equals(PriceCategory.WEEK)) {
            return ChronoUnit.WEEKS;
        } else if (ticketCategory.equals(PriceCategory.MONTH)) {
            return ChronoUnit.MONTHS;
        } else {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
    }

    void validateOrderRequest(CreateOrderRequest request) {
        StringJoiner fieldError = new StringJoiner(", ");
        if (DataUtils.isNullOrEmpty(request.getLocationId())) {
            fieldError.add("mã địa điểm");
        }
        if (DataUtils.isNullOrEmpty(request.getTicketId())) {
            fieldError.add("mã vé");
        }
        if (DataUtils.isNullOrEmpty(request.getStartTime())) {
            fieldError.add("thời điểm hiệu lực");
        }
        if (DataUtils.isNullOrEmpty(request.getTicketCategory())) {
            fieldError.add("loại vé");
        }
        if (DataUtils.isNullOrEmpty(request.getQuality())) {
            fieldError.add("thời gian sử dụng");
        }
        if (fieldError.length() > 0) {
            String message = fieldError + " không được để trống";
            String messageReturn = message.substring(0, 1).toUpperCase() + message.substring(1);
            throw new AppException(ErrorCode.INVALID_DATA.withMessage(messageReturn));
        }

        if (!DataUtils.isNullOrEmpty(request.getExtendTicketId())) {
            throw new AppException(ErrorCode.INVALID_DATA
                    .withMessage("Mã vé gia hạn không được có dữ liệu khi đặt đơn mới"));
        }
    }

    void validateValue(CreateOrderRequest request) {
        if (request.getQuality() <= 0) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thời gian sử dụng phải lớn hơn hoặc bằng 1"));
        }
        // kiểm tra giá trị thời gian sử dụng
        if ((request.getTicketCategory().equals(PriceCategory.TIME) && request.getQuality() > 24)
                || (request.getTicketCategory().equals(PriceCategory.DAY) && request.getQuality() > 7)
                || (request.getTicketCategory().equals(PriceCategory.WEEK) && request.getQuality() > 4)
                || (request.getTicketCategory().equals(PriceCategory.MONTH) && request.getQuality() != 1)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thời gian sử dụng vượt quá mức cho phép"));
        }
        // kiểm tra thời điểm hiệu lực khi tạo mới
        if (DataUtils.isNullOrEmpty(request.getExtendTicketId())) {
            // lỗi nếu thời điểm bắt đầu trước hiện tại hoặc sau 1 tuần
            if (request.getStartTime().isBefore(LocalDateTime.now())
                    || (request.getStartTime().isAfter(LocalDateTime.now().plusWeeks(1)))) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thời điểm hiệu lực không hợp lệ"));
            }
        }
    }

    void validateExtendRequest(CreateOrderRequest request) {
        StringJoiner fieldError = new StringJoiner(", ");
        if (!DataUtils.isNullOrEmpty(request.getLocationId())) {
            fieldError.add("mã địa điểm");
        }
        if (!DataUtils.isNullOrEmpty(request.getTicketId())) {
            fieldError.add("mã vé");
        }
        if (!DataUtils.isNullOrEmpty(request.getHelpBuy())) {
            fieldError.add("người được mua hộ");
        }
        if (!DataUtils.isNullOrEmpty(request.getStartTime())) {
            fieldError.add("thời điểm hiệu lực");
        }
        String message = fieldError + " không được có dữ liệu khi gia hạn vé";
        String messageReturn = message.charAt(0) + message.substring(1);
        throw new AppException(ErrorCode.INVALID_DATA.withMessage(messageReturn));
    }

    void processExtendTicket(CreateOrderRequest request) {
        validateExtendRequest(request);
        validateValue(request);
    }

    @Override
    public ApiResponse<Object> confirmOrder(ConfirmOrderRequest request) {
        if (!PaymentMethod.ALL_METHOD.contains(request.getPaymentMethod())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Phương thức không được hỗ trợ"));
        }
        String actionBy = ParkingServiceApplication.testPartnerActionBy;
        OrderParking order = orderRepository.findByOrderIdAndPaymentBy(request.getOrderId(), actionBy)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy thông tin đơn")));
        if (!order.getStatus().equals(OrderStatus.CHO_XAC_NHAN)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể xác nhận đơn"));
        }

        Payment payment;
        if (PaymentMethod.SO_DU.equals(request.getPaymentMethod())) {
            payment = processPaymentByRemaining(order);
        } else {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        return ApiResponse.builder()
                .result(payment)
                .build();
    }

    Payment processPaymentByRemaining(OrderParking order) {
        String actionBy = order.getPaymentBy();
        Account account = accountRepository.findByIdAndStatus(actionBy, AccountStatus.DANG_HOAT_DONG.getValue())
                .orElseThrow(() -> new AppException(ErrorCode.NO_ACCESS));
        // kiểm tra và cập nhật số dư
        long afterRemaining = account.getBalance() - order.getTotal();
        if (afterRemaining < 0) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Số dư không đủ"));
        } else {
            account.setBalance(afterRemaining);
            DataUtils.setDataAction(account, order.getPaymentBy(), false);
            accountRepository.save(account);
        }
        // cập nhật trạng thái đơn hàng
        order.setStatus(OrderStatus.DA_THANH_TOAN);
        DataUtils.setDataAction(order, actionBy, false);
        orderRepository.save(order);
        // lưu thông tin thanh toán
        Payment payment = Payment.builder()
                .objectId(order.getOrderId())
                .paymentBy(actionBy)
                .status(PaymentStatus.THANH_CONG)
                .type(PaymentType.MUA_VE)
                .paymentMethod(PaymentMethod.SO_DU)
                .fluctuation(Fluctuation.GIAM)
                .total(order.getTotal())
                .build();
        DataUtils.setDataAction(payment, actionBy, true);
        payment = paymentRepository.save(payment);
        // xử lý cấp vé
        processBuyTicketSuccess(order);
        return payment;
    }

    void processBuyTicketSuccess(OrderParking order) {
        // mua mới
        List<TicketPurchased> ticketPurchasedSave = new ArrayList<>();
        if (order.getExtendTicketId() == null) {
            // mua cho bản thân
            if (order.getOwners() == null) {
                TicketPurchased ticketPurchased = TicketPurchased.builder()
                        .accountId(order.getPaymentBy())
                        .ticketId(order.getTicketId())
                        .price(order.getTotal())
                        .status(TicketPurchasedStatus.BINH_THUONG)
                        .startsValidity(order.getStart())
                        .expires(order.getExpire())
                        .qrCode("")
                        .createdQrCodeCount(1)
                        .permitEditContentPlate(PermitEditContentPlate.CO)
                        .build();
                DataUtils.setDataAction(ticketPurchased, order.getPaymentBy(), true);
                ticketPurchasedSave.add(ticketPurchased);
            } else {
                // mua hộ
                List<String> owners = objectMapper.convertValue(order.getOwners(), new TypeReference<List<String>>() {
                });
                ticketPurchasedSave = owners.stream().map(item -> {
                    TicketPurchased ticketPurchased = TicketPurchased.builder()
                            .accountId(item)
                            .ticketId(order.getTicketId())
                            .price(order.getTotal())
                            .status(TicketPurchasedStatus.BINH_THUONG)
                            .startsValidity(order.getStart())
                            .expires(order.getExpire())
                            .qrCode("")
                            .createdQrCodeCount(1)
                            .permitEditContentPlate(PermitEditContentPlate.CO)
                            .build();
                    DataUtils.setDataAction(ticketPurchased, order.getPaymentBy(), true);
                    return ticketPurchased;
                }).toList();
            }
        } else {
            // gia hạn
        }
        ticketPurchasedRepository.saveAll(ticketPurchasedSave);
    }
}
