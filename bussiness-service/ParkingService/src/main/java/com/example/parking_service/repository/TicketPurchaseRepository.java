package com.example.parking_service.repository;

import com.example.parking_service.dto.response.TicketPurchasedResponse;
import com.example.parking_service.dto.response.TimeUseTicketPurchased;
import com.example.parking_service.entity.TicketPurchased;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TicketPurchaseRepository extends JpaRepository<TicketPurchased, String>, JpaSpecificationExecutor<TicketPurchased> {
    @Query("SELECT tp.qrCode from TicketPurchased tp where tp.id = :id and tp.accountId = :owner and tp.status = :status")
    String getQr(@Param("owner") String owner, @Param("id") String id, @Param("status") Integer status);

    Optional<TicketPurchased> findByIdAndAccountIdAndStatus(String id, String owner, Integer status);

    Optional<TicketPurchased> findByIdAndAccountId(String id, String accountId);

    boolean existsByIdAndAccountId(String id, String accountId);

    List<TicketPurchased> findByExpiresLessThanEqualAndUseStatusAndStatusIn(LocalDateTime endTimeScan, Integer useStatus, List<Integer> statusScan);

    @Query("SELECT new com.example.parking_service.dto.response.TimeUseTicketPurchased(tp.startsValidity, tp.expires) " +
            "FROM TicketPurchased tp WHERE tp.status = :status and tp.locationId = :locationId " +
            "AND :date BETWEEN FUNCTION('date', tp.startsValidity) AND FUNCTION('date', tp.expires)")
    List<TimeUseTicketPurchased> findTimeUseTicketPurchasedOfLocationAndDate(
            @Param("locationId") Long locationId,
            @Param("date") LocalDate date,
            @Param("status") Integer status
    );

    @Query("""
            SELECT new com.example.parking_service.dto.response.TicketPurchasedResponse(tp.id, tp.status, t.name, tp.createdBy, tp.createdAt, tp.price, t.partnerId) FROM TicketPurchased tp
            LEFT JOIN Ticket t ON t.ticketId = tp.ticketId
            where tp.accountId = :accountId
                """)
    Page<TicketPurchasedResponse> getAllByAccountId(String accountId, Pageable pageable);

    @Query("""
                SELECT count(t) FROM TicketPurchased t
                where t.createdAt between :start and :end
            """)
    Long layVeBanDuocTrongThang(LocalDateTime start, LocalDateTime end);

    @Query("SELECT count(t) FROM TicketPurchased t where t.extendCount > 0 and t.createdAt between :start and :end ")
    Long demSoLuongVeGiaHan(LocalDateTime start, LocalDateTime end);

    @Query("SELECT count(t) FROM TicketPurchased t where t.extendCount is null and t.createdAt between :start and :end ")
    Long demSoLuongVeKhongGiaHan(LocalDateTime start, LocalDateTime end);
}
