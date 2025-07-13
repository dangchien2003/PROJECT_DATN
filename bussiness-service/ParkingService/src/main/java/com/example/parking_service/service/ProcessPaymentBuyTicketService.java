package com.example.parking_service.service;

import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.dto.other.TicketQr;
import com.example.parking_service.entity.OrderParking;
import com.example.parking_service.entity.TicketPurchased;
import com.example.parking_service.enums.PermitEditContentPlate;
import com.example.parking_service.enums.TicketPurchasedStatus;
import com.example.parking_service.enums.TicketPurchasedUseStatus;
import com.example.parking_service.repository.TicketPurchasedRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class ProcessPaymentBuyTicketService {
    TicketPurchasedRepository ticketPurchasedRepository;
    ObjectMapper objectMapper;
    CryptoService crypto;

    public void processBuyTicketSuccess(OrderParking order) throws JsonProcessingException {
        // mua mới
        List<TicketPurchased> ticketPurchasedSave = new ArrayList<>();
        if (order.getExtendTicketId() == null) {
            // mua cho bản thân
            if (order.getOwners() == null) {

                String id = UUID.randomUUID().toString();
                TicketQr ticketQr = TicketQr.builder()
                        .accountId(order.getPaymentBy())
                        .ticketId(id)
                        .createdAt(LocalDateTime.now())
                        .build();
                TicketPurchased ticketPurchased = null;
                try {
                    ticketPurchased = TicketPurchased.builder()
                            .accountId(order.getPaymentBy())
                            .ticketId(order.getTicketId())
                            .locationId(order.getLocationId())
                            .price(order.getTotal())
                            .status(TicketPurchasedStatus.BINH_THUONG)
                            .useStatus(TicketPurchasedUseStatus.KHONG_SU_DUNG)
                            .startsValidity(order.getStart())
                            .expires(order.getExpire())
                            .qrCode(crypto.encrypt(objectMapper.writeValueAsString(ticketQr)))
                            .createdQrCodeCount(1)
                            .permitEditContentPlate(PermitEditContentPlate.CO)
                            .usedTimes(0L)
                            .build();
                } catch (JsonProcessingException e) {
                    throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
                }
                DataUtils.setDataAction(ticketPurchased, order.getPaymentBy(), true);
                ticketPurchasedSave.add(ticketPurchased);
            } else {
                // mua hộ
                List<String> owners = objectMapper.readValue(order.getOwners(), new TypeReference<List<String>>() {
                });
                ticketPurchasedSave = owners.stream().map(item -> {
                    String id = UUID.randomUUID().toString();
                    TicketQr ticketQr = TicketQr.builder()
                            .accountId(item)
                            .ticketId(id)
                            .createdAt(LocalDateTime.now())
                            .build();
                    TicketPurchased ticketPurchased = null;
                    try {
                        ticketPurchased = TicketPurchased.builder()
                                .id(id)
                                .accountId(item)
                                .ticketId(order.getTicketId())
                                .locationId(order.getLocationId())
                                .price(order.getTotal())
                                .status(TicketPurchasedStatus.BINH_THUONG)
                                .useStatus(TicketPurchasedUseStatus.KHONG_SU_DUNG)
                                .startsValidity(order.getStart())
                                .expires(order.getExpire())
                                .qrCode(crypto.encrypt(objectMapper.writeValueAsString(ticketQr)))
                                .createdQrCodeCount(1)
                                .permitEditContentPlate(PermitEditContentPlate.CO)
                                .usedTimes(0L)
                                .build();
                    } catch (JsonProcessingException e) {
                        throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
                    }
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
