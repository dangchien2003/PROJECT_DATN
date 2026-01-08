package com.example.parking_service.service.impl;

import com.example.common.dto.other.ContextHolderDto;
import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.enums.IsDel;
import com.example.common.enums.Release;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.context.UserContextHolder;
import com.example.parking_service.Specification.TicketSpecification;
import com.example.parking_service.Specification.TicketWaitReleaseSpecification;
import com.example.parking_service.dto.request.ApproveRequest;
import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.dto.request.SearchTicket;
import com.example.parking_service.dto.response.DataSearchTicketResponse;
import com.example.parking_service.entity.*;
import com.example.parking_service.enums.TypeTicket;
import com.example.parking_service.mapper.TicketMapper;
import com.example.parking_service.mapper.TicketWaitReleaseMapper;
import com.example.parking_service.repository.*;
import com.example.parking_service.service.NotifyService;
import com.example.parking_service.service.SchedulerService;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceImplTest {
    @InjectMocks
    TicketServiceImpl ticketService;

    @Mock
    TicketWaitReleaseRepository ticketWaitReleaseRepository;
    @Mock
    TicketLocationRepository ticketLocationRepository;
    @Mock
    TicketRepository ticketRepository;
    @Mock
    SchedulerService schedulerService;
    @Mock
    NotifyService notifyService;
    @Mock
    TicketMapper ticketMapper;
    @Mock
    AccountRepository accountRepository;
    Pageable pageable = PageRequest.of(0, 10);
    @Mock
    LocationRepository locationRepository;

    @Mock
    TicketSpecification ticketSpecification;
    @Mock
    TicketWaitReleaseSpecification ticketWaitReleaseSpecification;
    @Mock
    TicketWaitReleaseMapper ticketWaitReleaseMapper;

    @BeforeEach
    void setUp() {
        ContextHolderDto context = ContextHolderDto.builder()
                .uid("user-1")
                .build();
        UserContextHolder.setContext(context);
    }

    @AfterEach
    void tearDown() {
        UserContextHolder.clearContext();
    }

    private void mockUser(String uid, List<String> roles) {
        UserContextHolder.setContext(
                ContextHolderDto.builder()
                        .uid(uid)
                        .roles(roles)
                        .build()
        );
    }

    @Test
    void checkExistWaitRelease_notExist_success() {
        // given
        Long ticketId = 1L;
        when(ticketWaitReleaseRepository.existsByTicketIdAndIsDelAndReleased(
                ticketId,
                IsDel.DELETE_NOT_YET.getValue(),
                Release.RELEASE_NOT_YET.getValue()
        )).thenReturn(false);

        // when & then
        assertDoesNotThrow(() ->
                ticketService.checkExistWaitRelease(ticketId));

        verify(ticketWaitReleaseRepository).existsByTicketIdAndIsDelAndReleased(
                ticketId,
                IsDel.DELETE_NOT_YET.getValue(),
                Release.RELEASE_NOT_YET.getValue()
        );
    }

    @Test
    void checkExistWaitRelease_exist_throwConflict() {
        // given
        Long ticketId = 1L;
        when(ticketWaitReleaseRepository.existsByTicketIdAndIsDelAndReleased(
                ticketId,
                IsDel.DELETE_NOT_YET.getValue(),
                Release.RELEASE_NOT_YET.getValue()
        )).thenReturn(true);

        // when
        AppException ex = assertThrows(AppException.class, () ->
                ticketService.checkExistWaitRelease(ticketId));

        // then
        assertEquals(ErrorCode.CONFLICT_DATA, ex.getErrorCode());
    }

    @Test
    void checkExistWaitRelease_ticketIdNull_stillCallRepository() {
        // given
        when(ticketWaitReleaseRepository.existsByTicketIdAndIsDelAndReleased(
                isNull(),
                anyInt(),
                anyInt()
        )).thenReturn(false);

        // when
        assertDoesNotThrow(() ->
                ticketService.checkExistWaitRelease(null));

        // then
        verify(ticketWaitReleaseRepository).existsByTicketIdAndIsDelAndReleased(
                isNull(),
                anyInt(),
                anyInt()
        );
    }

    @Test
    void checkExistWaitRelease_repositoryThrowException() {
        // given
        Long ticketId = 1L;
        when(ticketWaitReleaseRepository.existsByTicketIdAndIsDelAndReleased(
                anyLong(),
                anyInt(),
                anyInt()
        )).thenThrow(new RuntimeException("DB error"));

        // when & then
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                ticketService.checkExistWaitRelease(ticketId));

        assertEquals("DB error", ex.getMessage());
    }

    @Test
    void cancelWaitRelease_notFound_throwException() {
        // given
        ApproveRequest request = new ApproveRequest();
        request.setId("1");

        when(ticketWaitReleaseRepository.findByIdAndIsDelAndReleased(
                eq(1L),
                eq(IsDel.DELETE_NOT_YET.getValue()),
                eq(Release.RELEASE_NOT_YET.getValue())
        )).thenReturn(Optional.empty());

        // when + then
        AppException ex = assertThrows(AppException.class,
                () -> ticketService.cancelWaitRelease(request, true));

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void cancelWaitRelease_lessThanOneHour_throwException() {
        // given
        ApproveRequest request = new ApproveRequest();
        request.setId("1");

        TicketWaitRelease entity = new TicketWaitRelease();
        entity.setId(1L);
        entity.setTimeAppliedEdit(LocalDateTime.now().plusMinutes(30));

        when(ticketWaitReleaseRepository.findByIdAndIsDelAndReleased(
                eq(1L),
                eq(IsDel.DELETE_NOT_YET.getValue()),
                eq(Release.RELEASE_NOT_YET.getValue())
        )).thenReturn(Optional.of(entity));

        // when + then
        AppException ex = assertThrows(AppException.class,
                () -> ticketService.cancelWaitRelease(request, true));

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());
    }

    @Test
    void cancelWaitRelease_admin_success() {
        // given
        ApproveRequest request = new ApproveRequest();
        request.setId("1");
        request.setReason("Không hợp lệ");

        TicketWaitRelease entity = new TicketWaitRelease();
        entity.setId(1L);
        entity.setTicketId(10L);
        entity.setPartnerId("partner-1");
        entity.setTimeAppliedEdit(LocalDateTime.now().plusHours(3));

        when(ticketWaitReleaseRepository.findByIdAndIsDelAndReleased(
                eq(1L),
                eq(IsDel.DELETE_NOT_YET.getValue()),
                eq(Release.RELEASE_NOT_YET.getValue())
        )).thenReturn(Optional.of(entity));

        when(ticketWaitReleaseRepository.save(any()))
                .thenAnswer(inv -> inv.getArgument(0));

        when(ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                anyLong(), anyInt(), anyInt()
        )).thenReturn(Collections.emptyList());

        DataSearchTicketResponse response = new DataSearchTicketResponse();

        when(ticketMapper.toDataSearchTicketResponse(any(TicketWaitRelease.class)))
                .thenReturn(response);

        // when
        ticketService.cancelWaitRelease(request, true);

        // then
        assertEquals(IsDel.DELETED.getValue(), entity.getIsDel());
        assertEquals("user-1", entity.getRejectBy());
        assertEquals("Không hợp lệ", entity.getReasonReject());

        verify(schedulerService).removeTask(any());
    }

    @Test
    void cancelWaitRelease_user_success_noRejectInfo() {
        // given
        ApproveRequest request = new ApproveRequest();
        request.setId("1");

        TicketWaitRelease entity = new TicketWaitRelease();
        entity.setId(1L);
        entity.setTicketId(10L);
        entity.setPartnerId("partner-1");
        entity.setTimeAppliedEdit(LocalDateTime.now().plusHours(2));

        when(ticketWaitReleaseRepository.findByIdAndIsDelAndReleased(
                eq(1L),
                eq(IsDel.DELETE_NOT_YET.getValue()),
                eq(Release.RELEASE_NOT_YET.getValue())
        )).thenReturn(Optional.of(entity));

        when(ticketWaitReleaseRepository.save(any()))
                .thenAnswer(inv -> inv.getArgument(0));

        when(ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                anyLong(), anyInt(), anyInt()
        )).thenReturn(Collections.emptyList());

        DataSearchTicketResponse response = new DataSearchTicketResponse();

        when(ticketMapper.toDataSearchTicketResponse(any(TicketWaitRelease.class)))
                .thenReturn(response);

        // when
        ticketService.cancelWaitRelease(request, false);

        // then
        assertEquals(IsDel.DELETED.getValue(), entity.getIsDel());
        assertNull(entity.getRejectBy());
        assertNull(entity.getReasonReject());
    }

    @Test
    void detail_ticketNotFound_throwException() {
        mockUser("user-1", List.of("ADMIN"));

        when(ticketRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(AppException.class,
                () -> ticketService.detail(1L));
    }

    @Test
    void detail_notAdmin_notOwner_throwNoAccess() {
        mockUser("user-1", List.of("USER"));

        Ticket ticket = new Ticket();
        ticket.setPartnerId("partner-2");

        when(ticketRepository.findById(1L))
                .thenReturn(Optional.of(ticket));

        assertThrows(AppException.class,
                () -> ticketService.detail(1L));
    }

    @Test
    void detail_admin_success() {
        mockUser("admin-1", List.of("ADMIN"));

        Ticket ticket = new Ticket();
        ticket.setTicketId(10L);
        ticket.setPartnerId("partner-1");

        DataSearchTicketResponse response = new DataSearchTicketResponse();
        response.setPartnerId("partner-1");

        when(ticketRepository.findById(1L))
                .thenReturn(Optional.of(ticket));
        when(ticketMapper.toDataSearchTicketResponse(ticket))
                .thenReturn(response);

        when(ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                eq(10L), any(), any()))
                .thenReturn(List.of(
                        new TicketLocation(1L, null, null, null, "100L", null),
                        new TicketLocation(2L, null, null, null, "200L", null)
                ));

        Account account = new Account();
        account.setPartnerFullName("Công ty ABC");

        when(accountRepository.findById("partner-1"))
                .thenReturn(Optional.of(account));

        ApiResponse<Object> apiResponse = ticketService.detail(1L);
        DataSearchTicketResponse result =
                (DataSearchTicketResponse) apiResponse.getResult();

        assertEquals("Công ty ABC", result.getPartnerName());
    }

    @Test
    void detail_partnerOwner_success() {
        mockUser("partner-1", List.of("USER"));

        Ticket ticket = new Ticket();
        ticket.setTicketId(20L);
        ticket.setPartnerId("partner-1");

        DataSearchTicketResponse response = new DataSearchTicketResponse();

        when(ticketRepository.findById(1L))
                .thenReturn(Optional.of(ticket));
        when(ticketMapper.toDataSearchTicketResponse(ticket))
                .thenReturn(response);
        when(ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                eq(20L), any(), any()))
                .thenReturn(Collections.emptyList());

        ApiResponse<Object> apiResponse = ticketService.detail(1L);

        assertNotNull(apiResponse.getResult());
        verify(accountRepository, never()).findById(any());
    }

    @Test
    void detailWaitRelease_notFound_throwException() {
        mockUser("admin-1", List.of("ADMIN"));

        when(ticketWaitReleaseRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(AppException.class,
                () -> ticketService.detailWaitRelease(1L));
    }

    @Test
    void detailWaitRelease_notAdmin_notOwner_throwNoAccess() {
        mockUser("user-1", List.of("USER"));

        TicketWaitRelease entity = new TicketWaitRelease();
        entity.setPartnerId("partner-2");

        when(ticketWaitReleaseRepository.findById(1L))
                .thenReturn(Optional.of(entity));

        assertThrows(AppException.class,
                () -> ticketService.detailWaitRelease(1L));
    }

    @Test
    void detailWaitRelease_admin_success() {
        mockUser("admin-1", List.of("ADMIN"));

        TicketWaitRelease entity = new TicketWaitRelease();
        entity.setId(10L);
        entity.setPartnerId("partner-1");

        DataSearchTicketResponse response = new DataSearchTicketResponse();
        response.setPartnerId("partner-1");

        when(ticketWaitReleaseRepository.findById(1L))
                .thenReturn(Optional.of(entity));
        when(ticketMapper.toDataSearchTicketResponse(entity))
                .thenReturn(response);

        when(ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                eq(10L),
                eq(TypeTicket.CHO_AP_DUNG.getValue()),
                eq(IsDel.DELETE_NOT_YET.getValue())
        )).thenReturn(List.of(
                new TicketLocation(1L, null, null, null, "100L", null),
                new TicketLocation(2L, null, null, null, "200L", null)
        ));

        Account account = new Account();
        account.setPartnerFullName("Công ty XYZ");

        when(accountRepository.findById("partner-1"))
                .thenReturn(Optional.of(account));

        ApiResponse<Object> apiResponse = ticketService.detailWaitRelease(1L);
        DataSearchTicketResponse result =
                (DataSearchTicketResponse) apiResponse.getResult();

        assertEquals("Công ty XYZ", result.getPartnerName());
    }

    @Test
    void detailWaitRelease_partnerOwner_success() {
        mockUser("partner-1", List.of("USER"));

        TicketWaitRelease entity = new TicketWaitRelease();
        entity.setId(20L);
        entity.setPartnerId("partner-1");

        DataSearchTicketResponse response = new DataSearchTicketResponse();

        when(ticketWaitReleaseRepository.findById(1L))
                .thenReturn(Optional.of(entity));
        when(ticketMapper.toDataSearchTicketResponse(entity))
                .thenReturn(response);
        when(ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                eq(20L),
                eq(TypeTicket.CHO_AP_DUNG.getValue()),
                eq(IsDel.DELETE_NOT_YET.getValue())
        )).thenReturn(Collections.emptyList());

        ApiResponse<Object> apiResponse = ticketService.detailWaitRelease(1L);

        assertNotNull(apiResponse.getResult());
        verify(accountRepository, never()).findById(any());
    }

    @Test
    void locationUseTicket_idNull_throwInvalidData() {
        AppException ex = assertThrows(
                AppException.class,
                () -> ticketService.locationUseTicket(null, pageable)
        );

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());
    }

    @Test
    void locationUseTicket_ticketNotExist_throwNotFound() {
        Long ticketId = 1L;

        when(ticketRepository.existsByTicketIdAndStatusIn(
                eq(ticketId),
                anyList()
        )).thenReturn(false);

        AppException ex = assertThrows(
                AppException.class,
                () -> ticketService.locationUseTicket(ticketId, pageable)
        );

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());

        verify(ticketLocationRepository, never())
                .findAllByObjectIdAndTypeAndIsDel(any(), any(), any());
    }

    @Test
    void locationUseTicket_ticketExist_noLocation_returnEmptyPage() {
        Long ticketId = 1L;

        when(ticketRepository.existsByTicketIdAndStatusIn(
                eq(ticketId),
                anyList()
        )).thenReturn(true);

        when(ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                eq(ticketId),
                eq(TypeTicket.PHAT_HANH.getValue()),
                eq(IsDel.DELETE_NOT_YET.getValue())
        )).thenReturn(Collections.emptyList());

        when(locationRepository.findByLocationIdInAndStatusIn(
                eq(Collections.emptyList()),
                anyList(),
                any(Pageable.class)
        )).thenReturn(Page.empty(pageable));

        ApiResponse<Object> response =
                ticketService.locationUseTicket(ticketId, pageable);

        PageResponse<?> pageResponse = (PageResponse<?>) response.getResult();

        assertEquals(0, pageResponse.getTotalElements());
    }

    @Test
    void locationUseTicket_success_returnLocationPage() {
        Long ticketId = 1L;

        TicketLocation ticketLocation = TicketLocation.builder()
                .objectId(ticketId)
                .locationId(100L)
                .type(TypeTicket.PHAT_HANH.getValue())
                .isDel(IsDel.DELETE_NOT_YET.getValue())
                .build();

        Location location = Location.builder()
                .locationId(100L)
                .name("Bãi xe A")
                .address("Hà Nội")
                .coordinatesX(10.0)
                .coordinatesY(20.0)
                .capacity(100L)
                .build();

        when(ticketRepository.existsByTicketIdAndStatusIn(
                eq(ticketId),
                anyList()
        )).thenReturn(true);

        when(ticketLocationRepository.findAllByObjectIdAndTypeAndIsDel(
                eq(ticketId),
                eq(TypeTicket.PHAT_HANH.getValue()),
                eq(IsDel.DELETE_NOT_YET.getValue())
        )).thenReturn(List.of(ticketLocation));

        when(locationRepository.findByLocationIdInAndStatusIn(
                eq(List.of(100L)),
                anyList(),
                any(Pageable.class)
        )).thenReturn(new PageImpl<>(List.of(location), pageable, 1));

        ApiResponse<Object> response =
                ticketService.locationUseTicket(ticketId, pageable);

        PageResponse<?> pageResponse = (PageResponse<?>) response.getResult();

        assertEquals(1, pageResponse.getTotalElements());
    }

    @Test
    void adminSearch_tabInvalid_throwInvalidData() {
        SearchTicket request = new SearchTicket();
        request.setTab(99);

        AppException ex = assertThrows(
                AppException.class,
                () -> ticketService.adminSearch(request, pageable)
        );

        assertEquals(ErrorCode.INVALID_DATA, ex.getErrorCode());
    }

    @Test
    void adminSearch_tab2_success() {
        SearchTicket request = new SearchTicket();
        request.setTab(2);

        Ticket ticket = new Ticket();
        ticket.setPartnerId("P2");

        DataSearchTicketResponse dto = new DataSearchTicketResponse();
        dto.setPartnerId("P2");

        when(ticketSpecification.adminSearch(
                any(), any(), any(), any(),
                any(), any(), any(),
                any(), any(), any(), any()
        )).thenReturn((root, query, cb) -> cb.conjunction());

        when(ticketRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(ticket), pageable, 1));

        when(ticketMapper.toDataSearchTicketResponse(ticket))
                .thenReturn(dto);

        Account account = new Account();
        account.setId("P2");
        account.setPartnerFullName("Đối tác B");

        when(accountRepository.findAllById(List.of("P2")))
                .thenReturn(List.of(account));

        ApiResponse<Object> response =
                ticketService.adminSearch(request, pageable);

        PageResponse<?> page = (PageResponse<?>) response.getResult();

        assertEquals(1, page.getTotalElements());
    }

    @Test
    void adminSearch_tab4_success() {
        SearchTicket request = new SearchTicket();
        request.setTab(4);

        TicketWaitRelease ticket = new TicketWaitRelease();
        ticket.setPartnerId("P3");

        DataSearchTicketResponse dto = new DataSearchTicketResponse();
        dto.setPartnerId("P3");

        when(ticketWaitReleaseSpecification.adminSearch(
                any(), any(), any(), any(),
                any(), any(), any(), any(),
                any(), any(), eq(true)
        )).thenReturn((root, query, cb) -> cb.conjunction());

        when(ticketWaitReleaseRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(ticket), pageable, 1));

        when(ticketMapper.toDataSearchTicketResponse(ticket))
                .thenReturn(dto);

        Account account = new Account();
        account.setId("P3");
        account.setPartnerFullName("Đối tác C");

        when(accountRepository.findAllById(List.of("P3")))
                .thenReturn(List.of(account));

        ApiResponse<Object> response =
                ticketService.adminSearch(request, pageable);

        PageResponse<?> page = (PageResponse<?>) response.getResult();

        assertEquals(1, page.getTotalElements());
    }

    @Test
    void modifyTicket_create_success() {
        ModifyTicketRequest request = new ModifyTicketRequest();
        request.setTicketId(null);
        request.setLocationUse(List.of(1L, 2L));

        TicketWaitRelease waitRelease = new TicketWaitRelease();

        when(ticketWaitReleaseMapper.toTicketWaitRelease(request))
                .thenReturn(waitRelease);

        when(ticketWaitReleaseRepository.save(any(TicketWaitRelease.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        ApiResponse<Object> response = ticketService.modifyTicket(request);

        assertNotNull(response);

        verify(ticketWaitReleaseRepository).save(any(TicketWaitRelease.class));
        verify(ticketRepository, never()).save(any());
    }

    @Test
    void modifyTicket_ticketNotFound_throwNotFound() {
        ModifyTicketRequest request = new ModifyTicketRequest();
        request.setTicketId(1L);

        when(ticketRepository.findById(1L))
                .thenReturn(Optional.empty());

        AppException ex = assertThrows(
                AppException.class,
                () -> ticketService.modifyTicket(request)
        );

        assertEquals(ErrorCode.NOT_FOUND, ex.getErrorCode());
    }
    

    @Test
    void modifyTicket_update_success() {
        ModifyTicketRequest request = new ModifyTicketRequest();
        request.setTicketId(1L);
        request.setLocationUse(List.of(1L, 2L));

        Ticket ticket = new Ticket();
        ticket.setTicketId(1L);
        ticket.setPartnerId("user-1");
        ticket.setModifyCount(0);

        TicketWaitRelease waitRelease = new TicketWaitRelease();
        waitRelease.setId(1L);
        waitRelease.setTimeAppliedEdit(LocalDateTime.now());

        when(ticketRepository.findById(1L))
                .thenReturn(Optional.of(ticket));

        when(ticketRepository.save(any(Ticket.class)))
                .thenReturn(ticket);

        when(ticketWaitReleaseMapper.toTicketWaitRelease(ticket))
                .thenReturn(waitRelease);

        when(ticketWaitReleaseRepository.save(any(TicketWaitRelease.class)))
                .thenReturn(waitRelease);

        ApiResponse<Object> response = ticketService.modifyTicket(request);

        assertNotNull(response);

        verify(ticketRepository).save(any(Ticket.class));
        verify(ticketWaitReleaseRepository).save(any(TicketWaitRelease.class));
    }

}
