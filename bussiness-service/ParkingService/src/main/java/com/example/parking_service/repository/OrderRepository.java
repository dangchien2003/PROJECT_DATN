package com.example.parking_service.repository;

import com.example.parking_service.dto.response.StatisticalTicketPurchasedOfPartner;
import com.example.parking_service.entity.OrderParking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderParking, String> {
    Optional<OrderParking> findByOrderIdAndPaymentBy(String orderId, String paymentBy);

    @Query("""
                SELECT new com.example.parking_service.dto.response.StatisticalTicketPurchasedOfPartner(
                    t.ticketId,
                    t.name,
                    o.ticketCategory,
                    o.locationId,
                    o.qualityTicket,
                    o.total,
                    t.vehicle,
                    o.createdAt,
                    o.start,
                    o.expire
                ) from OrderParking  o
                LEFT JOIN Ticket t on t.ticketId = o.ticketId
                where t.partnerId = :partnerId
                and o.status = 2 and o.extendTicketId is null
            """)
    Page<StatisticalTicketPurchasedOfPartner> getListTicketPurchaseOfPartner(String partnerId, Pageable pageable);
}
