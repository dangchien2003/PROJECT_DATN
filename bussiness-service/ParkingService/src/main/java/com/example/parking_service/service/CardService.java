package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.*;
import org.springframework.data.domain.Pageable;

public interface CardService {
    ApiResponse<Object> requestAdditional(RequestAdditionalCard request);

    ApiResponse<Object> getListCardApproved(Pageable pageable);

    ApiResponse<Object> getHistoryRequestAdditional(Pageable pageable);

    ApiResponse<Object> active(ActiveCardRequest request);

    ApiResponse<Object> adminSearch(SearchCardByAdminRequest request, Pageable pageable);

    ApiResponse<Object> adminSearchRequest(SearchCardAddByAdminRequest request, Pageable pageable);

    ApiResponse<Object> rejectRequest(RejectRequestAddCard request);

    ApiResponse<Object> approveRequest(Long id);

    ApiResponse<Object> madeCard(Long id);

    ApiResponse<Object> lock(Long id, boolean lock);

    ApiResponse<Object> permanentLock(Long id);

    ApiResponse<Object> linkTicket(LinkTicketRequest request);

    ApiResponse<Object> cancelLinkTicket(Long cardId);
}
