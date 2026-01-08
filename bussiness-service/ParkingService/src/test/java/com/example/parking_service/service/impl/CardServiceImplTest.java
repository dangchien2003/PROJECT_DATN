package com.example.parking_service.service.impl;

import com.example.common.dto.kafka.PushNotifyRequest;
import com.example.common.dto.other.ContextHolderDto;
import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.entity.BaseEntity_;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.dto.request.ActiveCardRequest;
import com.example.parking_service.dto.request.RejectRequestAddCard;
import com.example.parking_service.dto.request.RequestAdditionalCard;
import com.example.parking_service.dto.request.SearchCardByAdminRequest;
import com.example.parking_service.dto.response.CardResponse;
import com.example.parking_service.dto.response.HistoryRequestAddCardResponse;
import com.example.parking_service.dto.response.SearchCardByAdminResponse;
import com.example.parking_service.dto.response.UsedTimesByCardResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.entity.Card;
import com.example.parking_service.enums.CardStatus;
import com.example.parking_service.mapper.CardMapper;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.repository.CardRepository;
import com.example.parking_service.repository.TicketInOutRepository;
import com.example.parking_service.service.NotifyService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CardServiceImplTest {
    @InjectMocks
    private CardServiceImpl cardService;

    @Mock
    private CardRepository cardRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private NotifyService notifyService;
    @Mock
    private CardMapper cardMapper;
    @Mock
    private TicketInOutRepository ticketInOutRepository;

    @BeforeEach
    void setUp() {
        // Mock UserContext
        UserContextHolder.setContext(
                ContextHolderDto.builder()
                        .uid("test-account-id")
                        .build()
        );
    }

    @AfterEach
    void tearDown() {
        UserContextHolder.clearContext();
    }

    @Test
    void requestAdditional_firstTime_success() {
        // given
        RequestAdditionalCard request = new RequestAdditionalCard("Cần cấp thêm thẻ");

        Page<Card> emptyPage = new PageImpl<>(Collections.emptyList());
        when(cardRepository.findByAccountId(anyString(), any(Pageable.class)))
                .thenReturn(emptyPage);

        when(cardRepository.save(any(Card.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(accountRepository.getAdminId())
                .thenReturn(List.of("admin1"));

        // when
        ApiResponse<Object> response = cardService.requestAdditional(request);

        // then
        assertNotNull(response);

        ArgumentCaptor<Card> cardCaptor = ArgumentCaptor.forClass(Card.class);
        verify(cardRepository).save(cardCaptor.capture());

        Card savedCard = cardCaptor.getValue();
        assertEquals("test-account-id", savedCard.getAccountId());
        assertEquals(1, savedCard.getRequestTimes());
        assertEquals(CardStatus.CHO_DUYET, savedCard.getStatus());

        verify(notifyService).pushNotify(any(PushNotifyRequest.class));
    }

    @Test
    void requestAdditional_previousPending_throwException() {
        // given
        Card latestCard = Card.builder()
                .accountId("test-account-id")
                .status(CardStatus.CHO_DUYET)
                .createdAt(LocalDateTime.now().minusHours(30))
                .requestTimes(1)
                .build();

        Page<Card> page = new PageImpl<>(List.of(latestCard));
        when(cardRepository.findByAccountId(anyString(), any(Pageable.class)))
                .thenReturn(page);

        RequestAdditionalCard request = new RequestAdditionalCard("Lý do");

        // when + then
        AppException ex = assertThrows(AppException.class,
                () -> cardService.requestAdditional(request));

        assertTrue(ex.getMessage().contains("Không thể gửi yêu cầu"));
        verify(cardRepository, never()).save(any());
    }

    @Test
    void requestAdditional_within24Hours_throwException() {
        // given
        Card latestCard = Card.builder()
                .accountId("test-account-id")
                .status(CardStatus.TU_CHOI)
                .createdAt(LocalDateTime.now().minusHours(5))
                .requestTimes(1)
                .build();

        Page<Card> page = new PageImpl<>(List.of(latestCard));
        when(cardRepository.findByAccountId(anyString(), any(Pageable.class)))
                .thenReturn(page);

        RequestAdditionalCard request = new RequestAdditionalCard("Lý do");

        // when + then
        assertThrows(AppException.class,
                () -> cardService.requestAdditional(request));

        verify(cardRepository, never()).save(any());
    }

    @Test
    void requestAdditional_after24Hours_success() {
        // given
        Card latestCard = Card.builder()
                .accountId("test-account-id")
                .status(CardStatus.TU_CHOI)
                .createdAt(LocalDateTime.now().minusHours(25))
                .requestTimes(2)
                .build();

        Page<Card> page = new PageImpl<>(List.of(latestCard));
        when(cardRepository.findByAccountId(anyString(), any(Pageable.class)))
                .thenReturn(page);

        when(cardRepository.save(any(Card.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(accountRepository.getAdminId())
                .thenReturn(List.of("admin1", "admin2"));

        RequestAdditionalCard request = new RequestAdditionalCard("Lý do mới");

        // when
        cardService.requestAdditional(request);

        // then
        ArgumentCaptor<Card> cardCaptor = ArgumentCaptor.forClass(Card.class);
        verify(cardRepository).save(cardCaptor.capture());

        Card saved = cardCaptor.getValue();
        assertEquals(3, saved.getRequestTimes());
        assertEquals(CardStatus.CHO_DUYET, saved.getStatus());

        verify(notifyService).pushNotify(any());
    }

    @Test
    void getListCardApproved_statusChoKichHoat_maskNumberCard() {
        // given
        Pageable pageable = PageRequest.of(0, 10);

        Account account = new Account();
        account.setFullName("Nguyen Van A");

        when(accountRepository.findById("test-account-id"))
                .thenReturn(Optional.of(account));

        Card card = Card.builder()
                .numberCard("1234567890123456")
                .status(CardStatus.CHO_KICH_HOAT)
                .build();

        Page<Card> cardPage = new PageImpl<>(List.of(card), pageable, 1);

        when(cardRepository.findByAccountIdAndStatusNotIn(
                eq("test-account-id"),
                anyList(),
                any(Pageable.class)
        )).thenReturn(cardPage);

        CardResponse cardResponse = new CardResponse();
        cardResponse.setNumberCard("1234567890123456");
        cardResponse.setStatus(CardStatus.CHO_KICH_HOAT);

        when(cardMapper.toCardResponse(card))
                .thenReturn(cardResponse);

        when(ticketInOutRepository.countUsedTimeCard(anyList()))
                .thenReturn(Collections.emptyList());

        // when
        ApiResponse<Object> response =
                cardService.getListCardApproved(pageable);

        // then
        PageResponse<?> pageResponse =
                (PageResponse<?>) response.getResult();

        CardResponse result =
                (CardResponse) pageResponse.getData().get(0);

        assertEquals("123456789012 - - - -", result.getNumberCard());
        assertEquals("Nguyen Van A", result.getOwner());
    }

    @Test
    void getListCardApproved_activeCard_setUsedTimes() {
        // given
        Pageable pageable = PageRequest.of(0, 10);
        Account account = new Account();
        account.setFullName("Nguyen Van A");
        when(accountRepository.findById(anyString()))
                .thenReturn(Optional.of(account));

        Card card = Card.builder()
                .numberCard("CARD001")
                .status(CardStatus.DANG_HOAT_DONG)
                .build();

        Page<Card> page = new PageImpl<>(List.of(card));

        when(cardRepository.findByAccountIdAndStatusNotIn(any(), anyList(), any()))
                .thenReturn(page);

        when(ticketInOutRepository.countUsedTimeCard(List.of("CARD001")))
                .thenReturn(
                        List.of(new UsedTimesByCardResponse("CARD001", 5L))
                );

        CardResponse cardResponse = new CardResponse();
        cardResponse.setNumberCard("CARD001");
        cardResponse.setStatus(CardStatus.DANG_HOAT_DONG);

        when(cardMapper.toCardResponse(card))
                .thenReturn(cardResponse);

        // when
        ApiResponse<Object> response =
                cardService.getListCardApproved(pageable);

        // then
        PageResponse<?> pageResponse =
                (PageResponse<?>) response.getResult();

        CardResponse result =
                (CardResponse) pageResponse.getData().get(0);

        assertEquals(5L, result.getUsedTimes());
    }

    @Test
    void getListCardApproved_noUsedTimes_defaultZero() {
        // given
        Pageable pageable = PageRequest.of(0, 10);
        Account account = new Account();
        account.setFullName("Nguyen Van A");
        when(accountRepository.findById(any()))
                .thenReturn(Optional.of(account));

        Card card = Card.builder()
                .numberCard("CARD002")
                .status(CardStatus.TAM_KHOA)
                .build();

        when(cardRepository.findByAccountIdAndStatusNotIn(any(), anyList(), any()))
                .thenReturn(new PageImpl<>(List.of(card)));

        when(ticketInOutRepository.countUsedTimeCard(anyList()))
                .thenReturn(Collections.emptyList());

        CardResponse cardResponse = new CardResponse();
        cardResponse.setNumberCard("CARD002");
        cardResponse.setStatus(CardStatus.TAM_KHOA);

        when(cardMapper.toCardResponse(card))
                .thenReturn(cardResponse);

        // when
        ApiResponse<Object> response =
                cardService.getListCardApproved(pageable);

        // then
        PageResponse<?> pageResponse =
                (PageResponse<?>) response.getResult();

        CardResponse result =
                (CardResponse) pageResponse.getData().get(0);

        assertEquals(0L, result.getUsedTimes());
    }

    @Test
    void getHistoryRequestAdditional_success() {
        // given
        String accountId = "account-1";
        Pageable pageable = PageRequest.of(0, 10);

        Card card1 = new Card();
        Card card2 = new Card();

        Page<Card> cardPage = new PageImpl<>(
                List.of(card1, card2),
                pageable,
                2
        );

        when(cardRepository.findByAccountId(eq(accountId), any(Pageable.class)))
                .thenReturn(cardPage);

        when(cardMapper.toHistoryRequestAddCardResponse(card1))
                .thenReturn(new HistoryRequestAddCardResponse());
        when(cardMapper.toHistoryRequestAddCardResponse(card2))
                .thenReturn(new HistoryRequestAddCardResponse());

        // when
        ApiResponse<Object> response =
                cardService.getHistoryRequestAdditional(pageable, accountId);

        // then
        assertNotNull(response);

        PageResponse<?> pageResponse = (PageResponse<?>) response.getResult();
        assertEquals(2, pageResponse.getTotalElements());
        assertEquals(1, pageResponse.getTotalPages());
        assertEquals(2, pageResponse.getData().size());

        verify(cardRepository, times(1))
                .findByAccountId(eq(accountId), any(Pageable.class));
        verify(cardMapper, times(2))
                .toHistoryRequestAddCardResponse(any(Card.class));
    }

    @Test
    void getHistoryRequestAdditional_emptyResult() {
        // given
        String accountId = "account-1";
        Pageable pageable = PageRequest.of(0, 10);

        Page<Card> emptyPage = Page.empty(pageable);

        when(cardRepository.findByAccountId(eq(accountId), any(Pageable.class)))
                .thenReturn(emptyPage);

        // when
        ApiResponse<Object> response =
                cardService.getHistoryRequestAdditional(pageable, accountId);

        // then
        PageResponse<?> pageResponse = (PageResponse<?>) response.getResult();
        assertNotNull(pageResponse);
        assertEquals(0, pageResponse.getTotalElements());
        assertEquals(0, pageResponse.getData().size());

        verify(cardMapper, never())
                .toHistoryRequestAddCardResponse(any());
    }

    @Test
    void getHistoryRequestAdditional_shouldSortByCreatedAtDesc() {
        // given
        String accountId = "account-1";
        Pageable pageable = PageRequest.of(0, 10);

        when(cardRepository.findByAccountId(eq(accountId), any(Pageable.class)))
                .thenAnswer(invocation -> {
                    Pageable p = invocation.getArgument(1);

                    Sort.Order order = p.getSort().getOrderFor(BaseEntity_.CREATED_AT);
                    assertNotNull(order);
                    assertEquals(Sort.Direction.DESC, order.getDirection());

                    return Page.empty(p);
                });

        // when
        cardService.getHistoryRequestAdditional(pageable, accountId);

        // then
        verify(cardRepository).findByAccountId(eq(accountId), any(Pageable.class));
    }

    @Test
    void getHistoryRequestAdditional_repositoryThrowException() {
        // given
        String accountId = "account-1";
        Pageable pageable = PageRequest.of(0, 10);

        when(cardRepository.findByAccountId(eq(accountId), any(Pageable.class)))
                .thenThrow(new RuntimeException("DB error"));

        // then
        assertThrows(RuntimeException.class, () ->
                cardService.getHistoryRequestAdditional(pageable, accountId)
        );
    }

    @Test
    void active_success() {
        // given
        String accountId = "test-account-id";

        ActiveCardRequest request = new ActiveCardRequest();
        request.setId(1L);
        request.setCode("ABC123");

        Card card = new Card();
        card.setId(1L);
        card.setAccountId(accountId);
        card.setStatus(CardStatus.CHO_KICH_HOAT);
        card.setCodeActive("ABC123");
        card.setNumberCard("123456789");

        when(cardRepository.findByIdAndAccountId(1L, accountId))
                .thenReturn(Optional.of(card));
        CardResponse cardResponse = new CardResponse();
        cardResponse.setNumberCard("123456789");
        when(cardMapper.toCardResponse(any(Card.class)))
                .thenReturn(cardResponse);

        UsedTimesByCardResponse usedTimes = new UsedTimesByCardResponse();
        usedTimes.setTimes(5L);

        when(ticketInOutRepository.countUsedTimeCard(List.of("123456789")))
                .thenReturn(List.of(usedTimes));

        // when
        ApiResponse<Object> response = cardService.active(request);

        // then
        assertNotNull(response);
        CardResponse result = (CardResponse) response.getResult();

        assertEquals(CardStatus.DANG_HOAT_DONG, card.getStatus());
        assertEquals(5L, result.getUsedTimes());

        verify(cardRepository).save(card);
        verify(cardMapper).toCardResponse(card);
    }

    @Test
    void active_cardNotFound() {
        // given
        ActiveCardRequest request = new ActiveCardRequest();
        request.setId(1L);
        request.setCode("ABC123");

        when(cardRepository.findByIdAndAccountId(1L, "test-account-id"))
                .thenReturn(Optional.empty());

        // then
        AppException ex = assertThrows(AppException.class,
                () -> cardService.active(request));

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void active_invalidStatus() {
        // given
        ActiveCardRequest request = new ActiveCardRequest();
        request.setId(1L);
        request.setCode("ABC123");

        Card card = new Card();
        card.setStatus(CardStatus.DANG_HOAT_DONG);

        when(cardRepository.findByIdAndAccountId(1L, "test-account-id"))
                .thenReturn(Optional.of(card));

        // then
        AppException ex = assertThrows(AppException.class,
                () -> cardService.active(request));

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());
        verify(cardRepository, never()).save(any());
    }

    @Test
    void active_invalidCode() {
        // given
        ActiveCardRequest request = new ActiveCardRequest();
        request.setId(1L);
        request.setCode("WRONG");

        Card card = new Card();
        card.setStatus(CardStatus.CHO_KICH_HOAT);
        card.setCodeActive("CORRECT");

        when(cardRepository.findByIdAndAccountId(1L, "test-account-id"))
                .thenReturn(Optional.of(card));

        // then
        AppException ex = assertThrows(AppException.class,
                () -> cardService.active(request));

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());
        verify(cardRepository, never()).save(any());
    }

    // =========================
    // TC1: SEARCH SUCCESS
    // =========================
    @Test
    void adminSearch_success() {
        // given
        SearchCardByAdminRequest request = new SearchCardByAdminRequest();
        request.setEmailOwner("test@gmail.com");
        request.setNumberCard("123");
        request.setRequestName("nguyen");
        request.setStatus(1);
        request.setType(1);
        request.setIssuedDate(List.of(
                LocalDate.of(2024, 1, 1),
                LocalDate.of(2024, 12, 31)
        ));

        Pageable pageable = PageRequest.of(0, 10);

        Card card = new Card();
        card.setAccountId("acc-1");
        card.setRequestCreateBy("acc-2");
        card.setIssuedDate(LocalDate.of(2024, 5, 1));

        Page<Card> cardPage = new PageImpl<>(List.of(card), pageable, 1);

        when(cardRepository.adminSearch(
                any(), any(), any(),
                any(), any(),
                any(), any(),
                eq(pageable)
        )).thenReturn(cardPage);

        Account owner = new Account();
        owner.setId("acc-1");
        owner.setFullName("Nguyen Van A");

        Account requester = new Account();
        requester.setId("acc-2");
        requester.setFullName("Tran Van B");

        when(accountRepository.findAllById(anySet()))
                .thenReturn(List.of(owner, requester));

        SearchCardByAdminResponse response = new SearchCardByAdminResponse();
        when(cardMapper.toSearchCardByAdminResponse(card))
                .thenReturn(response);

        // when
        ApiResponse<Object> apiResponse =
                cardService.adminSearch(request, pageable);

        // then
        PageResponse<?> pageResponse = (PageResponse<?>) apiResponse.getResult();
        assertEquals(1, pageResponse.getTotalElements());
        assertEquals(1, pageResponse.getData().size());

        SearchCardByAdminResponse result =
                (SearchCardByAdminResponse) pageResponse.getData().get(0);

        assertEquals("Tran Van B", result.getRequestName());
        assertEquals("Nguyen Van A", result.getOwnerName());
        assertEquals(LocalDate.of(2024, 5, 1), result.getIssuedDate());
    }

    // =========================
    // TC2: ISSUED DATE NULL
    // =========================
    @Test
    void adminSearch_issuedDateNull() {
        // given
        SearchCardByAdminRequest request = new SearchCardByAdminRequest();
        Pageable pageable = PageRequest.of(0, 10);

        Card card = new Card();
        card.setAccountId("acc-1");
        card.setRequestCreateBy("acc-1");

        Page<Card> cardPage = new PageImpl<>(List.of(card), pageable, 1);

        when(cardRepository.adminSearch(
                any(), any(), any(),
                isNull(), isNull(),
                any(), any(),
                eq(pageable)
        )).thenReturn(cardPage);

        Account account = new Account();
        account.setId("acc-1");
        account.setFullName("Admin");

        when(accountRepository.findAllById(anySet()))
                .thenReturn(List.of(account));

        when(cardMapper.toSearchCardByAdminResponse(card))
                .thenReturn(new SearchCardByAdminResponse());

        // when
        ApiResponse<Object> apiResponse =
                cardService.adminSearch(request, pageable);

        // then
        PageResponse<?> pageResponse = (PageResponse<?>) apiResponse.getResult();
        assertEquals(1, pageResponse.getTotalElements());
    }

    // =========================
    // TC3: EMPTY RESULT
    // =========================
    @Test
    void adminSearch_emptyResult() {
        // given
        SearchCardByAdminRequest request = new SearchCardByAdminRequest();
        Pageable pageable = PageRequest.of(0, 10);

        when(cardRepository.adminSearch(
                any(), any(), any(),
                any(), any(),
                any(), any(),
                eq(pageable)
        )).thenReturn(Page.empty(pageable));

        // when
        ApiResponse<Object> apiResponse =
                cardService.adminSearch(request, pageable);

        // then
        PageResponse<?> pageResponse = (PageResponse<?>) apiResponse.getResult();
        assertEquals(0, pageResponse.getTotalElements());

        verify(cardMapper, never()).toSearchCardByAdminResponse(any());
    }

    // =========================
    // TC4: ACCOUNT FULLNAME NULL → USE EMAIL
    // =========================
    @Test
    void adminSearch_accountFullNameNull_useEmail() {
        // given
        SearchCardByAdminRequest request = new SearchCardByAdminRequest();
        Pageable pageable = PageRequest.of(0, 10);

        Card card = new Card();
        card.setAccountId("acc-1");
        card.setRequestCreateBy("acc-1");

        Page<Card> cardPage = new PageImpl<>(List.of(card), pageable, 1);

        when(cardRepository.adminSearch(
                any(), any(), any(),
                any(), any(),
                any(), any(),
                eq(pageable)
        )).thenReturn(cardPage);

        Account account = new Account();
        account.setId("acc-1");
        account.setEmail("test@gmail.com");

        when(accountRepository.findAllById(anySet()))
                .thenReturn(List.of(account));

        SearchCardByAdminResponse response = new SearchCardByAdminResponse();
        when(cardMapper.toSearchCardByAdminResponse(card))
                .thenReturn(response);

        // when
        ApiResponse<Object> apiResponse =
                cardService.adminSearch(request, pageable);

        // then
        PageResponse<?> pageResponse = (PageResponse<?>) apiResponse.getResult();
        SearchCardByAdminResponse result =
                (SearchCardByAdminResponse) pageResponse.getData().get(0);

        assertEquals("test@gmail.com", result.getOwnerName());
        assertEquals("test@gmail.com", result.getRequestName());
    }

    // =========================
    // TC1: REJECT SUCCESS
    // =========================
    @Test
    void rejectRequest_success() {
        // given
        RejectRequestAddCard request = new RejectRequestAddCard();
        request.setId(1L);
        request.setReason("Thiếu thông tin");

        Card card = new Card();
        card.setId(1L);
        card.setStatus(CardStatus.CHO_DUYET);
        card.setAccountId("user-1");

        when(cardRepository.findById(1L))
                .thenReturn(Optional.of(card));

        // when
        ApiResponse<Object> response =
                cardService.rejectRequest(request);

        // then
        assertNotNull(response);
        assertEquals(CardStatus.TU_CHOI, card.getStatus());
        assertEquals("Thiếu thông tin", card.getReasonReject());

        verify(cardRepository).save(card);
        verify(notifyService).pushNotify(any(PushNotifyRequest.class));
    }

    // =========================
    // TC2: CARD NOT FOUND
    // =========================
    @Test
    void rejectRequest_notFound() {
        // given
        RejectRequestAddCard request = new RejectRequestAddCard();
        request.setId(1L);

        when(cardRepository.findById(1L))
                .thenReturn(Optional.empty());

        // then
        AppException ex = assertThrows(AppException.class,
                () -> cardService.rejectRequest(request));

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());

        verify(cardRepository, never()).save(any());
        verify(notifyService, never()).pushNotify(any());
    }

    // =========================
    // TC3: INVALID STATUS
    // =========================
    @Test
    void rejectRequest_invalidStatus() {
        // given
        RejectRequestAddCard request = new RejectRequestAddCard();
        request.setId(1L);
        request.setReason("Lý do");

        Card card = new Card();
        card.setStatus(CardStatus.DANG_HOAT_DONG);

        when(cardRepository.findById(1L))
                .thenReturn(Optional.of(card));

        // then
        AppException ex = assertThrows(AppException.class,
                () -> cardService.rejectRequest(request));

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());

        verify(cardRepository, never()).save(any());
        verify(notifyService, never()).pushNotify(any());
    }

    // =========================
    // TC4: NOTIFY THROW EXCEPTION
    // =========================
    @Test
    void rejectRequest_notifyThrowException() {
        // given
        RejectRequestAddCard request = new RejectRequestAddCard();
        request.setId(1L);
        request.setReason("Không hợp lệ");

        Card card = new Card();
        card.setId(1L);
        card.setStatus(CardStatus.CHO_DUYET);
        card.setAccountId("user-1");

        when(cardRepository.findById(1L))
                .thenReturn(Optional.of(card));

        doThrow(new RuntimeException("Notify error"))
                .when(notifyService).pushNotify(any());

        // when (không throw exception)
        ApiResponse<Object> response =
                cardService.rejectRequest(request);

        // then
        assertNotNull(response);
        assertEquals(CardStatus.TU_CHOI, card.getStatus());

        verify(cardRepository).save(card);
        verify(notifyService).pushNotify(any());
    }

    @Test
    void approveRequest_idNull() {
        AppException ex = assertThrows(AppException.class,
                () -> cardService.approveRequest(null));

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());
    }

    @Test
    void approveRequest_notFound() {
        when(cardRepository.findById(1L)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class,
                () -> cardService.approveRequest(1L));

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void approveRequest_invalidStatus() {
        Card card = new Card();
        card.setStatus(CardStatus.DANG_HOAT_DONG);

        when(cardRepository.findById(1L)).thenReturn(Optional.of(card));

        AppException ex = assertThrows(AppException.class,
                () -> cardService.approveRequest(1L));

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());
    }

    @Test
    void approveRequest_success() {
        Card card = new Card();
        card.setStatus(CardStatus.CHO_DUYET);
        card.setAccountId("user-1");

        when(cardRepository.findById(1L)).thenReturn(Optional.of(card));

        ApiResponse<Object> response = cardService.approveRequest(1L);

        assertEquals(CardStatus.CHO_CAP, card.getStatus());
        verify(cardRepository).save(card);
        verify(notifyService).pushNotify(any());
    }

    @Test
    void madeCard_notFound() {
        when(cardRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(AppException.class,
                () -> cardService.madeCard(1L));
    }

    @Test
    void madeCard_invalidStatus() {
        Card card = new Card();
        card.setStatus(CardStatus.CHO_DUYET);

        when(cardRepository.findById(1L)).thenReturn(Optional.of(card));

        assertThrows(AppException.class,
                () -> cardService.madeCard(1L));
    }

    @Test
    void madeCard_success() {
        Card card = new Card();
        card.setStatus(CardStatus.CHO_CAP);
        card.setAccountId("user-1");

        when(cardRepository.findById(1L)).thenReturn(Optional.of(card));
        when(cardRepository.getMaxIssuedTimesByOwner("user-1")).thenReturn(1);

        ApiResponse<Object> response = cardService.madeCard(1L);

        assertEquals(CardStatus.CHO_KICH_HOAT, card.getStatus());
        assertNotNull(card.getNumberCard());
        assertNotNull(card.getCodeActive());
        assertEquals(2, card.getIssuedTimes());

        verify(cardRepository).save(card);
    }

    @Test
    void madeCard_sendMailException() {
        Card card = new Card();
        card.setStatus(CardStatus.CHO_CAP);
        card.setAccountId("user-1");

        when(cardRepository.findById(1L)).thenReturn(Optional.of(card));
        when(accountRepository.findById(any()))
                .thenThrow(new RuntimeException());

        assertDoesNotThrow(() -> cardService.madeCard(1L));
    }

    @Test
    void lock_notOwner() {
        when(cardRepository.findByIdAndAccountId(1L, "test-account-id"))
                .thenReturn(Optional.empty());

        assertThrows(AppException.class,
                () -> cardService.lock(1L, true));
    }

    @Test
    void lock_invalidStatus() {
        Card card = new Card();
        card.setStatus(CardStatus.TAM_KHOA);

        when(cardRepository.findByIdAndAccountId(1L, "test-account-id"))
                .thenReturn(Optional.of(card));

        assertThrows(AppException.class,
                () -> cardService.lock(1L, true));
    }

    @Test
    void unlock_beforeOneHour() {
        Card card = new Card();
        card.setStatus(CardStatus.TAM_KHOA);
        card.setLockAt(LocalDateTime.now());

        when(cardRepository.findByIdAndAccountId(1L, "test-account-id"))
                .thenReturn(Optional.of(card));

        assertThrows(AppException.class,
                () -> cardService.lock(1L, false));
    }

    @Test
    void lock_success() {
        Card card = new Card();
        card.setStatus(CardStatus.DANG_HOAT_DONG);
        card.setNumberCard("123");
        CardResponse cardResponse = new CardResponse();
        cardResponse.setNumberCard("1234567890123456");
        when(cardRepository.findByIdAndAccountId(1L, "test-account-id"))
                .thenReturn(Optional.of(card));
        when(cardMapper.toCardResponse(any()))
                .thenReturn(cardResponse);
        when(ticketInOutRepository.countUsedTimeCard(any()))
                .thenReturn(List.of());

        ApiResponse<Object> response = cardService.lock(1L, true);

        assertEquals(CardStatus.TAM_KHOA, card.getStatus());
        verify(cardRepository).save(card);
    }
}
