package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.RequestAdditionalCard;
import com.example.parking_service.dto.response.CardResponse;
import com.example.parking_service.dto.response.HistoryRequestAddCardResponse;
import com.example.parking_service.entity.Card;
import com.example.parking_service.entity.Card_;
import com.example.parking_service.enums.CardStatus;
import com.example.parking_service.enums.TypeCard;
import com.example.parking_service.mapper.CardMapper;
import com.example.parking_service.repository.CardRepository;
import com.example.parking_service.service.CardService;
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
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class CardServiceImpl implements CardService {
    CardRepository cardRepository;
    CardMapper cardMapper;

    @Override
    public ApiResponse<Object> requestAdditional(RequestAdditionalCard request) {
        String owner = ParkingServiceApplication.testPartnerActionBy;
        // lần lần yêu cầu gần nhất
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        List<Card> cardLatestList = cardRepository.findByAccountId(owner, pageable).getContent();
        Card cardLatest = null;
        // lấy giá trị đầu tiên
        if (!cardLatestList.isEmpty()) {
            cardLatest = cardLatestList.getFirst();
        }
        // kiểm tra trong 24H chỉ cho gửi 1 yêu cầu
        if (cardLatest != null
                && (cardLatest.getStatus().equals(CardStatus.CHO_DUYET)
                || cardLatest.getCreatedAt().plusHours(24).isAfter(LocalDateTime.now()))) {
            throw new AppException(ErrorCode.NO_ACCESS
                    .withMessage("Không thể gửi yêu cầu nếu yêu cầu trước đó chưa được xử lý hoặc chưa qua 24 giờ"));
        }
        // tăng số lần lên 1
        Integer newIssuedTimes = cardLatest == null ? 0 : cardLatest.getIssuedTimes() + 1;
        // dữ liệu yêu cầu
        Card card = Card.builder()
                .accountId(owner)
                .issuedTimes(newIssuedTimes)
                .type(TypeCard.THE_CA_NHAN)
                .status(CardStatus.CHO_DUYET)
                .requestCreateBy(owner)
                .reasonRequest(request.getReason())
                .build();
        DataUtils.setDataAction(card, owner, true);
        cardRepository.save(card);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> getListCardApproved(Pageable pageable) {
        Pageable pageQuery = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, Card_.ISSUED_TIMES));
        String owner = ParkingServiceApplication.testPartnerActionBy;
        String ownerName = "LÊ ĐĂNG CHIẾN"; // lấy từ token
        List<Integer> statusNotGet = List.of(CardStatus.CHO_DUYET, CardStatus.TU_CHOI, CardStatus.CHO_CAP);
        Page<Card> cards = cardRepository.findByAccountIdAndStatusNotIn(owner, statusNotGet, pageQuery);
        Random random = new Random();
        List<CardResponse> result = cards.map(item -> {
            CardResponse cardResponse = cardMapper.toCardResponse(item);
            if (cardResponse.getStatus().equals(CardStatus.CHO_KICH_HOAT)) {
                String numberCard = cardResponse.getNumberCard().substring(0, cardResponse.getNumberCard().length() - 4) + " - - - -";
                cardResponse.setNumberCard(numberCard);
                cardResponse.setOwner(ownerName);
            }
            if (cardResponse.getStatus().equals(CardStatus.DANG_HOAT_DONG)
                    || cardResponse.getStatus().equals(CardStatus.TAM_KHOA)
                    || cardResponse.getStatus().equals(CardStatus.KHOA_VINH_VIEN)) {
                cardResponse.setUsedTimes(random.nextLong(100));
            }
            return cardResponse;
        }).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, cards.getTotalPages(), cards.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getHistoryRequestAdditional(Pageable pageable) {
        String owner = ParkingServiceApplication.testPartnerActionBy;
        Pageable pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        Page<Card> cardPage = cardRepository.findByAccountId(owner, pageRequest);
        List<HistoryRequestAddCardResponse> result = cardPage.map(cardMapper::toHistoryRequestAddCardResponse).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, cardPage.getTotalPages(), cardPage.getTotalElements()))
                .build();
    }
}
