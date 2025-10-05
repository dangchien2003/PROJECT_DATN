package com.example.parking_service.repository;

import com.example.parking_service.dto.response.DetailTicketInOutResponse;
import com.example.parking_service.dto.response.TicketInOutByAccountResponse;
import com.example.parking_service.entity.TicketInOut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TicketInOutRepository extends JpaRepository<TicketInOut, Long> {
    Page<TicketInOut> findByTicketPurchasedId(String ticketPurchasedId, Pageable pageable);

    @Query("""
            select new com.example.parking_service.dto.response.TicketInOutByAccountResponse(
            m.id, l.name, m.checkinAt, m.checkoutAt) from TicketInOut m
            join TicketPurchased t on t.id = m.ticketPurchasedId
            join Location l on l.locationId = m.locationId
            where t.accountId = :accountId
            """)
    Page<TicketInOutByAccountResponse> findByAccountId(String accountId, Pageable pageable);

    @Query("""
            select new com.example.parking_service.dto.response.TicketInOutByAccountResponse(
            m.id, '' , m.checkinAt, m.checkoutAt) from TicketInOut m
            join Location l on l.locationId = m.locationId
            where l.locationId = :locationId and l.partnerId = :partnerId
            """)
    Page<TicketInOutByAccountResponse> findByLocationId(Long locationId, String partnerId, Pageable pageable);

    @Query("""
                select tio from TicketPurchased tp
                right join TicketInOut tio on tio.ticketPurchasedId = tp.id
                left join Ticket t on t.ticketId = tp.ticketId
                where tp.id = :ticketPurchasedId
                  and (:partnerId is null or t.partnerId = :partnerId)
            """)
    Page<TicketInOut> findHistoryByAdmin(String ticketPurchasedId, String partnerId, Pageable pageable);

    @Query("""
                select new com.example.parking_service.dto.response.DetailTicketInOutResponse(
                m.id, l.name, m.position, m.checkinAt, m.checkinMethod, m.imagePlateIn,
                m.checkoutAt, m.checkoutMethod, m.imagePlateOut, m.numberCard
                ) from TicketInOut m
                join Location l on l.locationId = m.locationId
                where m.id = :id
            """)
    Optional<DetailTicketInOutResponse> detail(Long id);

    @Query("""
                select tio from TicketInOut tio
                join TicketPurchased  t on t.id = tio.ticketPurchasedId
                where tio.ticketPurchasedId = :ticketId
                and t.accountId = :accountId
            """)
    Page<TicketInOut> findByTicketId(String ticketId, String accountId, Pageable pageable);
}
