package com.example.parking_service.Specification;

import com.example.parking_service.entity.TicketPurchased;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketPurchasedSpecification {
    Specification<TicketPurchased> customerSearch(
            List<Long> locationIds,
            LocalDateTime fromBuyDate,
            LocalDateTime toBuyDate,
            LocalDateTime useDate,
            Integer tab,
            String accountId
    );
}
