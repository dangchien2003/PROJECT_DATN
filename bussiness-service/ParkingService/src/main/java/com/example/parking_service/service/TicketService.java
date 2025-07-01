package com.example.parking_service.service;

import com.example.common.dto.response.ApiResponse;
import com.example.parking_service.dto.request.ApproveRequest;
import com.example.parking_service.dto.request.CustomerSearchTicket;
import com.example.parking_service.dto.request.ModifyTicketRequest;
import com.example.parking_service.dto.request.SearchTicket;
import org.springframework.data.domain.Pageable;

public interface TicketService {
    ApiResponse<Object> modifyTicket(ModifyTicketRequest request);

    ApiResponse<Object> partnerSearch(SearchTicket request, Pageable pageable);

    ApiResponse<Object> adminSearch(SearchTicket request, Pageable pageable);

    ApiResponse<Object> search(CustomerSearchTicket request, Pageable pageable);

    ApiResponse<Object> detail(Long id);

    ApiResponse<Object> detailWaitRelease(Long id);

    ApiResponse<Object> customerDetail(Long id);

    ApiResponse<Object> locationUseTicket(Long id, Pageable pageable);

    ApiResponse<Object> cancelWaitRelease(ApproveRequest approveRequest, boolean isAdmin);

    void checkExistWaitRelease(Long ticketId);

    void loadScheduler();
}
