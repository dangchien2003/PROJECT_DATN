package com.example.parking_service.service.impl;

import com.example.common.dto.other.ContextHolderDto;
import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.Specification.TicketPurchasedSpecification;
import com.example.parking_service.dto.request.CustomerSearchTicketPurchasedRequest;
import com.example.parking_service.dto.request.PartnerSearchHistoryBuyTicketPurchasedRequest;
import com.example.parking_service.dto.response.CusTicketPurchasedDetailResponse;
import com.example.parking_service.dto.response.LocationNameDTO;
import com.example.parking_service.dto.response.PartnerSearchHistoryBuyTicketPurchasedResponse;
import com.example.parking_service.dto.response.TicketNameDTO;
import com.example.parking_service.entity.TicketPurchased;
import com.example.parking_service.enums.TicketPurchasedStatus;
import com.example.parking_service.mapper.TicketPurchasedMapper;
import com.example.parking_service.repository.LocationRepository;
import com.example.parking_service.repository.TicketPurchaseRepository;
import com.example.parking_service.repository.TicketRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class TicketPurchasedServiceImplTest {

    @InjectMocks
    TicketPurchasedServiceImpl ticketPurchasedService;

    @Mock
    TicketPurchaseRepository ticketPurchaseRepository;
    @Mock
    TicketPurchasedSpecification ticketPurchasedSpecification;
    @Mock
    TicketRepository ticketRepository;
    @Mock
    LocationRepository locationRepository;
    @Mock
    TicketPurchasedMapper ticketPurchasedMapper;

    @BeforeEach
    void setupContext() {
        ContextHolderDto context = new ContextHolderDto();
        context.setUid("customer-1");
        context.setRoles(List.of("CUSTOMER"));
        UserContextHolder.setContext(context);
    }

    @AfterEach
    void clear() {
        UserContextHolder.clearContext();
    }

    @Test
    void customerSearch_invalidTab_throwInvalidData() {
        CustomerSearchTicketPurchasedRequest request =
                new CustomerSearchTicketPurchasedRequest();
        request.setTab(5); // invalid

        Pageable pageable = PageRequest.of(0, 10);

        AppException ex = assertThrows(
                AppException.class,
                () -> ticketPurchasedService.customerSearch(request, pageable)
        );

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());
    }

    @Test
    void customerSearch_emptyResult_returnEmptyPage() {
        CustomerSearchTicketPurchasedRequest request =
                new CustomerSearchTicketPurchasedRequest();
        request.setTab(1);

        Pageable pageable = PageRequest.of(0, 10);
        when(ticketPurchasedSpecification.customerSearch(
                any(), any(), any(), any(), anyInt(), anyString()
        )).thenReturn((root, q, cb) -> null);

        when(ticketPurchaseRepository.findAll(
                any(Specification.class),
                any(Pageable.class)
        )).thenReturn(Page.empty());

        ApiResponse<Object> response =
                ticketPurchasedService.customerSearch(request, pageable);

        PageResponse<?> page = (PageResponse<?>) response.getResult();

        assertEquals(0, page.getTotalElements());
        assertTrue(page.getData().isEmpty());
    }

    @Test
    void customerSearch_withLocationName_callLocationRepository() {
        CustomerSearchTicketPurchasedRequest request =
                new CustomerSearchTicketPurchasedRequest();
        request.setTab(1);
        request.setLocationName("Bai xe");

        Pageable pageable = PageRequest.of(0, 10);

        when(locationRepository.getListIdByName(any()))
                .thenReturn(List.of(1L));

        when(ticketPurchasedSpecification.customerSearch(
                any(), any(), any(), any(), any(), any()
        )).thenReturn((root, query, cb) -> null);

        when(ticketPurchaseRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(Page.empty());

        ticketPurchasedService.customerSearch(request, pageable);

        verify(locationRepository).getListIdByName(any());
    }

    @Test
    void getQr_success() {
        String ticketPurchasedId = "tp-1";
        String qr = "QR_CODE_123";

        when(ticketPurchaseRepository.getQr(
                "customer-1",
                ticketPurchasedId,
                TicketPurchasedStatus.BINH_THUONG
        )).thenReturn(qr);

        ApiResponse<Object> response =
                ticketPurchasedService.getQr(ticketPurchasedId);

        assertEquals(qr, response.getResult());

        verify(ticketPurchaseRepository).getQr(
                "customer-1",
                ticketPurchasedId,
                TicketPurchasedStatus.BINH_THUONG
        );
    }

    @Test
    void getQr_notFound_throwException() {
        String ticketPurchasedId = "tp-1";

        when(ticketPurchaseRepository.getQr(
                anyString(),
                anyString(),
                anyInt()
        )).thenReturn(null);

        AppException ex = assertThrows(
                AppException.class,
                () -> ticketPurchasedService.getQr(ticketPurchasedId)
        );

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void getQr_repositoryReturnNull_throwNotFound() {
        when(ticketPurchaseRepository.getQr(
                eq("customer-1"),
                eq("tp-2"),
                eq(TicketPurchasedStatus.BINH_THUONG)
        )).thenReturn(null);

        AppException ex = assertThrows(
                AppException.class,
                () -> ticketPurchasedService.getQr("tp-2")
        );

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void getQr_useAccountIdFromUserContext() {
        when(ticketPurchaseRepository.getQr(
                anyString(),
                anyString(),
                anyInt()
        )).thenReturn("QR");

        ticketPurchasedService.getQr("tp-3");

        verify(ticketPurchaseRepository).getQr(
                eq("customer-1"),
                eq("tp-3"),
                eq(TicketPurchasedStatus.BINH_THUONG)
        );
    }


    @Test
    void detail_success_fullData() {
        String id = "tp-1";

        TicketPurchased ticketPurchased = new TicketPurchased();
        ticketPurchased.setId(id);
        ticketPurchased.setTicketId(10L);
        ticketPurchased.setLocationId(20L);

        CusTicketPurchasedDetailResponse response =
                new CusTicketPurchasedDetailResponse();

        when(ticketPurchaseRepository.findByIdAndAccountId(id, "customer-1"))
                .thenReturn(Optional.of(ticketPurchased));

        when(ticketPurchasedMapper.toCusTicketPurchasedDetailResponse(ticketPurchased))
                .thenReturn(response);

        when(ticketRepository.findDTOByTicketIdIn(List.of(10L)))
                .thenReturn(List.of(new TicketNameDTO(null, "Vé gửi xe")));

        when(locationRepository.getNameDto(List.of(20L)))
                .thenReturn(List.of(new LocationNameDTO(null, "Bãi xe A", "Hà Nội")));

        ApiResponse<Object> apiResponse =
                ticketPurchasedService.detail(id);

        CusTicketPurchasedDetailResponse result =
                (CusTicketPurchasedDetailResponse) apiResponse.getResult();

        assertEquals("Vé gửi xe", result.getTicketName());
        assertEquals("Bãi xe A", result.getLocationName());
        assertEquals("Hà Nội", result.getLocationAddress());
    }

    @Test
    void detail_notFound_throwException() {
        when(ticketPurchaseRepository.findByIdAndAccountId(
                anyString(), anyString()
        )).thenReturn(Optional.empty());

        AppException ex = assertThrows(
                AppException.class,
                () -> ticketPurchasedService.detail("tp-404")
        );

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());
    }


    @Test
    void detail_ticketNameEmpty_notSetTicketName() {
        TicketPurchased ticketPurchased = new TicketPurchased();
        ticketPurchased.setId("tp-2");
        ticketPurchased.setTicketId(1L);
        ticketPurchased.setLocationId(2L);

        CusTicketPurchasedDetailResponse response =
                new CusTicketPurchasedDetailResponse();

        when(ticketPurchaseRepository.findByIdAndAccountId("tp-2", "customer-1"))
                .thenReturn(Optional.of(ticketPurchased));

        when(ticketPurchasedMapper.toCusTicketPurchasedDetailResponse(ticketPurchased))
                .thenReturn(response);

        when(ticketRepository.findDTOByTicketIdIn(List.of(1L)))
                .thenReturn(List.of());

        when(locationRepository.getNameDto(List.of(2L)))
                .thenReturn(List.of());

        ApiResponse<Object> apiResponse =
                ticketPurchasedService.detail("tp-2");

        CusTicketPurchasedDetailResponse result =
                (CusTicketPurchasedDetailResponse) apiResponse.getResult();

        assertNull(result.getTicketName());
        assertNull(result.getLocationName());
    }

    @Test
    void detail_useAccountIdFromContext() {
        TicketPurchased ticketPurchased = new TicketPurchased();
        ticketPurchased.setId("1L");
        ticketPurchased.setTicketId(1L);
        ticketPurchased.setLocationId(1L);
        when(ticketPurchaseRepository.findByIdAndAccountId(
                anyString(), anyString()
        )).thenReturn(Optional.of(ticketPurchased));

        when(ticketPurchasedMapper.toCusTicketPurchasedDetailResponse(ticketPurchased))
                .thenReturn(new CusTicketPurchasedDetailResponse());

        when(ticketRepository.findDTOByTicketIdIn(any()))
                .thenReturn(List.of());

        when(locationRepository.getNameDto(any()))
                .thenReturn(List.of());

        ticketPurchasedService.detail("tp-3");

        verify(ticketPurchaseRepository).findByIdAndAccountId(
                eq("tp-3"),
                eq("customer-1")
        );
    }

    @Test
    void historyBuyTicket_noDate_success() {
        PartnerSearchHistoryBuyTicketPurchasedRequest request =
                new PartnerSearchHistoryBuyTicketPurchasedRequest();
        request.setTicketId(1L);
        request.setStatus(1);

        Pageable pageable = PageRequest.of(0, 10);
        String partnerId = "partner-1";

        Page<PartnerSearchHistoryBuyTicketPurchasedResponse> page =
                new PageImpl<>(List.of(), pageable, 0);

        when(ticketPurchaseRepository.historyBuyTicket(
                eq(partnerId),
                eq(1L),
                eq(1),
                any(LocalDateTime.class),
                isNull(), isNull(),
                isNull(), isNull(),
                any(Pageable.class)
        )).thenReturn(page);

        ApiResponse<Object> response =
                ticketPurchasedService.historyBuyTicket(request, partnerId, pageable);

        PageResponse<?> result = (PageResponse<?>) response.getResult();

        assertEquals(0, result.getTotalElements());
        assertEquals(0, result.getTotalPages());
    }

    @Test
    void historyBuyTicket_withBuyDate_success() {
        PartnerSearchHistoryBuyTicketPurchasedRequest request =
                new PartnerSearchHistoryBuyTicketPurchasedRequest();
        request.setBuyDate(List.of(
                LocalDateTime.of(2024, 1, 1, 10, 0),
                LocalDateTime.of(2024, 1, 3, 15, 0)
        ));

        Pageable pageable = PageRequest.of(0, 10);
        String partnerId = "partner-1";

        when(ticketPurchaseRepository.historyBuyTicket(
                eq(partnerId),
                isNull(),
                isNull(),
                any(LocalDateTime.class),
                any(LocalDateTime.class),
                any(LocalDateTime.class),
                isNull(),
                isNull(),
                any(Pageable.class)
        )).thenReturn(Page.empty());

        ticketPurchasedService.historyBuyTicket(request, partnerId, pageable);

        verify(ticketPurchaseRepository).historyBuyTicket(
                eq(partnerId),
                isNull(),
                isNull(),
                any(LocalDateTime.class),
                argThat(d -> d.toLocalDate().equals(LocalDate.of(2024, 1, 1))),
                argThat(d -> d.toLocalDate().equals(LocalDate.of(2024, 1, 3))),
                isNull(),
                isNull(),
                any(Pageable.class)
        );
    }

    @Test
    void historyBuyTicket_withUseDate_success() {
        PartnerSearchHistoryBuyTicketPurchasedRequest request =
                new PartnerSearchHistoryBuyTicketPurchasedRequest();
        request.setUseDate(List.of(
                LocalDateTime.of(2024, 2, 1, 8, 0),
                LocalDateTime.of(2024, 2, 2, 18, 0)
        ));

        Pageable pageable = PageRequest.of(0, 10);
        String partnerId = "partner-1";

        when(ticketPurchaseRepository.historyBuyTicket(
                eq(partnerId),
                isNull(),
                isNull(),
                any(LocalDateTime.class),
                isNull(), isNull(),
                any(LocalDateTime.class),
                any(LocalDateTime.class),
                any(Pageable.class)
        )).thenReturn(Page.empty());

        ticketPurchasedService.historyBuyTicket(request, partnerId, pageable);

        verify(ticketPurchaseRepository).historyBuyTicket(
                eq(partnerId),
                isNull(),
                isNull(),
                any(LocalDateTime.class),
                isNull(),
                isNull(),
                argThat(d -> d.toLocalDate().equals(LocalDate.of(2024, 2, 1))),
                argThat(d -> d.toLocalDate().equals(LocalDate.of(2024, 2, 2))),
                any(Pageable.class)
        );
    }

    @Test
    void historyBuyTicket_hasData_returnCorrectPage() {
        PartnerSearchHistoryBuyTicketPurchasedResponse item =
                new PartnerSearchHistoryBuyTicketPurchasedResponse();

        Page<PartnerSearchHistoryBuyTicketPurchasedResponse> page =
                new PageImpl<>(List.of(item), PageRequest.of(0, 10), 1);

        when(ticketPurchaseRepository.historyBuyTicket(
                any(), any(), any(),
                any(LocalDateTime.class),
                any(), any(),
                any(), any(),
                any(Pageable.class)
        )).thenReturn(page);

        ApiResponse<Object> response =
                ticketPurchasedService.historyBuyTicket(
                        new PartnerSearchHistoryBuyTicketPurchasedRequest(),
                        "partner-1",
                        PageRequest.of(0, 10)
                );

        PageResponse<?> result = (PageResponse<?>) response.getResult();

        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getData().size());
    }

}