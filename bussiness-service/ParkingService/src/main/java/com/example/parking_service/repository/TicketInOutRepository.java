package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketInOut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TicketInOutRepository extends JpaRepository<TicketInOut, Long> {
    Page<TicketInOut> findByTicketPurchasedId(String ticketPurchasedId, Pageable pageable);

    @Query("""
                select tio from TicketPurchased tp
                right join TicketInOut tio on tio.ticketPurchasedId = tp.id
                left join Ticket t on t.ticketId = tp.ticketId
                where tp.id = :ticketPurchasedId
                  and (:partnerId is null or t.partnerId = :partnerId)
            """)
    Page<TicketInOut> findHistoryByAdmin(String ticketPurchasedId, String partnerId, Pageable pageable);
}
