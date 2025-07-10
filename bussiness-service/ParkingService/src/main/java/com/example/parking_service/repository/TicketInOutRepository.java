package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketInOut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketInOutRepository extends JpaRepository<TicketInOut, Long> {
    Page<TicketInOut> findByTicketPurchasedId(String ticketPurchasedId, Pageable pageable);
}
