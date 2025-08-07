package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.RandomUtils;
import com.example.common.utils.TimeUtil;
import com.example.parking_service.dto.request.*;
import com.example.parking_service.dto.response.CardResponse;
import com.example.parking_service.dto.response.DetailCardByAdminResponse;
import com.example.parking_service.dto.response.HistoryRequestAddCardResponse;
import com.example.parking_service.dto.response.SearchCardByAdminResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.entity.Card;
import com.example.parking_service.entity.Card_;
import com.example.parking_service.entity.TicketPurchased;
import com.example.parking_service.enums.CardStatus;
import com.example.parking_service.enums.TicketPurchasedStatus;
import com.example.parking_service.enums.TypeCard;
import com.example.parking_service.mapper.CardMapper;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.repository.CardRepository;
import com.example.parking_service.repository.TicketPurchaseRepository;
import com.example.parking_service.service.CardService;
import com.example.parking_service.utils.context.UserContextHolder;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class CardServiceImpl implements CardService {
    private final TicketPurchaseRepository ticketPurchaseRepository;
    private final AccountRepository accountRepository;
    CardRepository cardRepository;
    CardMapper cardMapper;
    Random random = new Random();

    @Override
    public ApiResponse<Object> requestAdditional(RequestAdditionalCard request) {
        String accountId = UserContextHolder.getContext().getUid();
        // lần lần yêu cầu gần nhất
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        List<Card> cardLatestList = cardRepository.findByAccountId(accountId, pageable).getContent();
        Card cardLatest = null;
        // lấy giá trị đầu tiên
        if (!cardLatestList.isEmpty()) {
            cardLatest = cardLatestList.getFirst();
        }
        // kiểm tra trong 24H chỉ cho gửi 1 yêu cầu
        if (cardLatest != null
                && (cardLatest.getStatus().equals(CardStatus.CHO_DUYET)
                || cardLatest.getCreatedAt().plusHours(24).isAfter(LocalDateTime.now()))) {
            throw new AppException(ErrorCode.INVALID_DATA
                    .withMessage("Không thể gửi yêu cầu nếu yêu cầu trước đó chưa được xử lý hoặc chưa qua 24 giờ"));
        }
        // tăng số lần lên 1
        Integer newIssuedTimes = cardLatest == null ? 1 : cardLatest.getRequestTimes() + 1;
        // dữ liệu yêu cầu
        Card card = Card.builder()
                .accountId(accountId)
                .requestTimes(newIssuedTimes)
                .type(TypeCard.THE_CA_NHAN)
                .status(CardStatus.CHO_DUYET)
                .requestCreateBy(accountId)
                .reasonRequest(request.getReason())
                .build();
        DataUtils.setDataAction(card, accountId, true);
        cardRepository.save(card);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> getListCardApproved(Pageable pageable) {
        Pageable pageQuery = PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, Card_.ISSUED_TIMES));
        String accountId = UserContextHolder.getContext().getUid();
        String ownerName = accountRepository.findById(accountId).get().getFullName();
        List<Integer> statusNotGet = List.of(CardStatus.CHO_DUYET, CardStatus.TU_CHOI, CardStatus.CHO_CAP);
        Page<Card> cards = cardRepository.findByAccountIdAndStatusNotIn(accountId, statusNotGet, pageQuery);
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
                this.genUseTimes(cardResponse);
            }
            return cardResponse;
        }).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, cards.getTotalPages(), cards.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> getHistoryRequestAdditional(Pageable pageable, String accountId) {
        Pageable pageRequest = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, BaseEntity_.CREATED_AT));
        Page<Card> cardPage = cardRepository.findByAccountId(accountId, pageRequest);
        List<HistoryRequestAddCardResponse> result = cardPage.map(cardMapper::toHistoryRequestAddCardResponse).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(result, cardPage.getTotalPages(), cardPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> active(ActiveCardRequest request) {
        String accountId = UserContextHolder.getContext().getUid();
        Card card = cardRepository.findByIdAndAccountId(request.getId(), accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Thẻ không xác định")));
        // kiểm tra trạng thái
        if (!card.getStatus().equals(CardStatus.CHO_KICH_HOAT)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể kích hoạt thẻ"));
        }
        // kiểm tra khớp mã kích hoạt
        if (!card.getCodeActive().equals(request.getCode())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Mã kích hoạt không khớp"));
        }
        card.setStatus(CardStatus.DANG_HOAT_DONG);
        DataUtils.setDataAction(card, accountId, false);
        cardRepository.save(card);
        CardResponse cardResponse = cardMapper.toCardResponse(card);
        this.genUseTimes(cardResponse);
        return ApiResponse.builder()
                .result(cardResponse)
                .build();
    }

    @Override
    public ApiResponse<Object> adminSearch(SearchCardByAdminRequest request, Pageable pageable) {
        String emailOwner = DataUtils.convertStringSearchLike(request.getEmailOwner());
        String numberCard = DataUtils.convertStringSearchLike(request.getNumberCard());
        String requestName = DataUtils.convertStringSearchLike(request.getRequestName());
        LocalDate issuedDateFrom = null;
        LocalDate issuedDateTo = null;
        if (!DataUtils.isNullOrEmpty(request.getIssuedDate())) {
            issuedDateFrom = request.getIssuedDate().getFirst();
            issuedDateTo = request.getIssuedDate().get(1);
        }

        Page<Card> cardPage = cardRepository.adminSearch(
                emailOwner, numberCard, requestName, issuedDateFrom, issuedDateTo,
                request.getStatus(), request.getType(), pageable);
        // lấy id người yêu cầu và chủ sở hữu
        Set<String> requesterIds = new HashSet<>();
        cardPage.forEach(item -> {
            requesterIds.add(item.getAccountId());
            requesterIds.add(item.getRequestCreateBy());
        });
        List<Account> accountList = accountRepository.findAllById(requesterIds);
        Map<String, String> accountsMap = accountList.stream().collect(
                Collectors.toMap(Account::getId, Account::getFullName));
        List<SearchCardByAdminResponse> response = cardPage.map(item -> {
            SearchCardByAdminResponse itemResponse = cardMapper.toSearchCardByAdminResponse(item);
            itemResponse.setRequestName(accountsMap.get(item.getRequestCreateBy()));
            itemResponse.setOwnerName(accountsMap.get(item.getAccountId()));
            if (item.getIssuedDate() != null) {
                itemResponse.setIssuedDate(item.getIssuedDate());
            }
            return itemResponse;
        }).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(response, cardPage.getTotalPages(), cardPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> adminSearchRequest(SearchCardAddByAdminRequest request, Pageable pageable) {
        String emailOwner = DataUtils.convertStringSearchLike(request.getEmailOwner());
        String requestName = DataUtils.convertStringSearchLike(request.getRequestName());
        LocalDateTime requestDateFrom = null;
        LocalDateTime requestDateTo = null;
        if (!DataUtils.isNullOrEmpty(request.getRequestDate())) {
            requestDateFrom = request.getRequestDate().getFirst().toLocalDate().atStartOfDay();
            requestDateTo = request.getRequestDate().get(1).toLocalDate().atTime(LocalTime.MAX);
        }

        Page<Card> cardPage = cardRepository.adminSearchRequestAdd(
                emailOwner, requestName, requestDateFrom, requestDateTo,
                request.getStatus(), request.getType(), pageable);
        // lấy id người yêu cầu và chủ sở hữu
        Set<String> requesterIds = new HashSet<>();
        cardPage.forEach(item -> {
            requesterIds.add(item.getAccountId());
            requesterIds.add(item.getRequestCreateBy());
        });
        List<Account> accountList = accountRepository.findAllById(requesterIds);
        Map<String, String> accountsMap = accountList.stream().collect(
                Collectors.toMap(Account::getId, Account::getFullName));
        List<SearchCardByAdminResponse> response = cardPage.map(item -> {
            SearchCardByAdminResponse itemResponse = cardMapper.toSearchCardByAdminResponse(item);
            itemResponse.setRequestName(accountsMap.get(item.getRequestCreateBy()));
            itemResponse.setRequestDate(item.getCreatedAt().toLocalDate());
            itemResponse.setOwnerName(accountsMap.get(item.getAccountId()));
            return itemResponse;
        }).toList();
        return ApiResponse.builder()
                .result(new PageResponse<>(response, cardPage.getTotalPages(), cardPage.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> rejectRequest(RejectRequestAddCard request) {
        String accountId = UserContextHolder.getContext().getUid();
        Card card = cardRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy yêu cầu")));
        if (!card.getStatus().equals(CardStatus.CHO_DUYET)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể thực hiện"));
        }
        card.setStatus(CardStatus.TU_CHOI);
        card.setReasonReject(request.getReason());
        DataUtils.setDataAction(card, accountId, false);
        cardRepository.save(card);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> approveRequest(Long id) {
        if (DataUtils.isNullOrEmpty(id)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không tìm thấy yêu cầu"));
        }
        String accountId = UserContextHolder.getContext().getUid();
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy yêu cầu")));
        if (!card.getStatus().equals(CardStatus.CHO_DUYET)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể thực hiện"));
        }
        card.setStatus(CardStatus.CHO_CAP);
        DataUtils.setDataAction(card, accountId, false);
        cardRepository.save(card);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> madeCard(Long id) {
        String accountId = UserContextHolder.getContext().getUid();
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy yêu cầu")));
        if (!card.getStatus().equals(CardStatus.CHO_CAP)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể thực hiện"));
        }
        // cập nhật trạng thái
        card.setStatus(CardStatus.CHO_KICH_HOAT);
        // gen số
        card.setNumberCard(TimeUtil.formatLocalDateTime(LocalDateTime.now(), "DDMMYY") + RandomUtils.randomNumber(8));
        // gen code
        card.setCodeActive(RandomUtils.randomNumber(6));
        // set lượt cấp
        Integer issuedTimes = cardRepository.getMaxIssuedTimesByOwner(card.getAccountId());
        card.setIssuedTimes(issuedTimes != null ? issuedTimes + 1 : 1);
        // set ngày phát hành
        card.setIssuedDate(LocalDate.now());
        DataUtils.setDataAction(card, accountId, false);
        cardRepository.save(card);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> lock(Long id, boolean lock) {
        String accountId = UserContextHolder.getContext().getUid();
        Card card = cardRepository.findByIdAndAccountId(id, accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Bạn không sở hữu thẻ này")));
        if (lock) {
            if (!card.getStatus().equals(CardStatus.DANG_HOAT_DONG)) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể khoá thẻ"));
            }
            card.setStatus(CardStatus.TAM_KHOA);
            card.setLockAt(LocalDateTime.now());
        } else {
            if (!card.getStatus().equals(CardStatus.TAM_KHOA)) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể khoá thẻ"));
            }
            if (card.getLockAt().plusHours(1).isAfter(LocalDateTime.now())) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Chỉ có thể mở khoá sau khi thư hiện khoá 1 giờ"));
            }
            card.setStatus(CardStatus.DANG_HOAT_DONG);
        }
        DataUtils.setDataAction(card, accountId, false);
        cardRepository.save(card);
        CardResponse cardResponse = cardMapper.toCardResponse(card);
        this.genUseTimes(cardResponse);
        return ApiResponse.builder()
                .result(cardResponse)
                .build();
    }

    @Override
    public ApiResponse<Object> permanentLock(Long id) {
        String accountId = UserContextHolder.getContext().getUid();
        Card card = cardRepository.findByIdAndAccountId(id, accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Bạn không sở hữu thẻ này")));
        List<Integer> statusAllow = List.of(CardStatus.DANG_HOAT_DONG, CardStatus.TAM_KHOA);
        if (!statusAllow.contains(card.getStatus())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể thực hiện"));
        }
        card.setStatus(CardStatus.KHOA_VINH_VIEN);
        card.setLockAt(LocalDateTime.now());
        DataUtils.setDataAction(card, accountId, false);
        cardRepository.save(card);
        CardResponse cardResponse = cardMapper.toCardResponse(card);
        this.genUseTimes(cardResponse);
        return ApiResponse.builder()
                .result(cardResponse)
                .build();
    }

    @Override
    public ApiResponse<Object> linkTicket(LinkTicketRequest request) {
        String accountId = UserContextHolder.getContext().getUid();
        Card card = cardRepository.findByIdAndAccountId(request.getCardId(), accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Bạn không sở hữu thẻ này")));
        if (!card.getStatus().equals(CardStatus.DANG_HOAT_DONG)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thẻ không hoạt động"));
        }
        TicketPurchased ticketPurchased = ticketPurchaseRepository.findByIdAndAccountId(request.getTicketId(), accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Bạn không sở hữu vé này")));
        // validate ticket
        LocalDateTime now = LocalDateTime.now();
        if (!ticketPurchased.getStatus().equals(TicketPurchasedStatus.BINH_THUONG)
                || now.isAfter(ticketPurchased.getExpires())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé không có hiệu lực"));
        }
        // kiểm tra vé đã được liên kết chưa
        if (cardRepository.existsByAccountIdAndTicketLinkAndStatusIn(
                accountId, ticketPurchased.getId(), List.of(CardStatus.DANG_HOAT_DONG, CardStatus.TAM_KHOA))) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé đã được liên kết"));
        }

        card.setTicketLink(ticketPurchased.getId());
        DataUtils.setDataAction(card, accountId, false);
        cardRepository.save(card);
        CardResponse cardResponse = cardMapper.toCardResponse(card);
        this.genUseTimes(cardResponse);
        return ApiResponse.builder()
                .result(cardResponse)
                .build();
    }

    @Override
    public ApiResponse<Object> cancelLinkTicket(Long cardId) {
        String accountId = UserContextHolder.getContext().getUid();
        Card card = cardRepository.findByIdAndAccountId(cardId, accountId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Bạn không sở hữu thẻ này")));
        card.setTicketLink(null);
        DataUtils.setDataAction(card, accountId, false);
        cardRepository.save(card);
        CardResponse cardResponse = cardMapper.toCardResponse(card);
        this.genUseTimes(cardResponse);
        return ApiResponse.builder()
                .result(cardResponse)
                .build();
    }

    @Override
    public ApiResponse<Object> detailCardByAdmin(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy dữ liệu")));
        DetailCardByAdminResponse response = convertCardResponse(card);
        response.setRequestDate(card.getCreatedAt().toLocalDate());
        response.setUsedTimes(random.nextLong(100));
        return ApiResponse.builder()
                .result(response)
                .build();
    }

    //    @Override
//    public ApiResponse<Object> lockCard(Long cardId) {
//        String actionBy = UserContextHolder.getContext().getUid();
//        Card card = cardRepository.findById(cardId)
//                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy dữ liệu")));
//        if (card.getStatus().equals(CardStatus.KHOA_VINH_VIEN)) {
//            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thẻ đang bị khoá vĩnh viễn. Hãy mở khoá trước"));
//        }
//        if (card.getStatus().equals(CardStatus.TAM_KHOA)) {
//            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thẻ đã ở trạng thái tạm khoá"));
//        }
//        card.setStatus(CardStatus.TAM_KHOA);
//        DataUtils.setDataAction(card, actionBy, false);
//        card = cardRepository.save(card);
//        return ApiResponse.builder()
//                .result(convertCardResponse(card))
//                .build();
//    }

    DetailCardByAdminResponse convertCardResponse(Card card) {
        DetailCardByAdminResponse response = cardMapper.toDetailCardByAdminResponse(card);
        // lấy tên chủ sở hữu và người yêu cầu
        List<Account> accounts = accountRepository.findAllById(List.of(card.getAccountId(), card.getRequestCreateBy()));
        Account owner = accounts.stream()
                .filter(item -> item.getId().equalsIgnoreCase(card.getAccountId()))
                .findFirst().orElse(null);
        Account request = accounts.stream()
                .filter(item -> item.getId().equalsIgnoreCase(card.getAccountId()))
                .findFirst().orElse(null);
        response.setOwner(owner != null ? owner.getFullName() : null);
        response.setRequestCreateName(request != null ? request.getFullName() : null);
        return response;
    }


    void genUseTimes(CardResponse cardResponse) {
        cardResponse.setUsedTimes(random.nextLong(100));
    }
}
