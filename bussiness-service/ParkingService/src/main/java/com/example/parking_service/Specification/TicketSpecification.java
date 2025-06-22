package com.example.parking_service.Specification;

import com.example.parking_service.entity.Ticket;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketSpecification {
    Specification<Ticket> partnerSearch(
            String ticketName,
            Integer status,
            Integer modifyStatus,
            LocalDateTime releasedTime,
            String trendReleasedTime,
            Integer vehicle,
            List<Long> ids,
            String partnerId,
            Long price,
            String trendPrice,
            Integer priceCategory
    );

    Specification<Ticket> adminSearch(
            String ticketName,
            Integer status,
            Integer modifyStatus,
            LocalDateTime releasedTime,
            String trendReleasedTime,
            Integer vehicle,
            List<Long> ids,
            List<String> partnerIds,
            Long price,
            String trendPrice,
            Integer priceCategory
    );
}
