package com.example.parking_service.repository;

import com.example.parking_service.dto.response.PartnerSearchHistoryBuyTicketPurchasedResponse;
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

    @Query("""
            select tp from TicketPurchased tp
              left join Ticket t on t.ticketId = tp.ticketId
              where tp.id = :id
              and (:partnerId is null or t.partnerId = :partnerId)
            """)
    Optional<TicketPurchased> findByIdByAdmin(String id, String partnerId);

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

    @Query("""
            select new com.example.parking_service.dto.response.PartnerSearchHistoryBuyTicketPurchasedResponse(
            tkp.id,
            nm.fullName,
            csh.fullName,
             CASE
                 WHEN tkp.status in (0, 2) AND tkp.startsValidity > :now
                     THEN 1
                 WHEN tkp.status in (0, 2) AND tkp.startsValidity <= :now AND tkp.expires > :now
                     THEN 2
                 WHEN tkp.status not in (0, 2) OR tkp.expires <= :now
                     THEN 3
                 ELSE 0
             END,
              tkp.startsValidity,
              tkp.expires,
              tkp.usedTimes
            ) from TicketPurchased tkp
            join Ticket t on t.ticketId = tkp.ticketId
            join Account csh on csh.id = tkp.accountId
            join Account nm on nm.id = tkp.createdBy
            where tkp.ticketId = :ticketId
            and (:partnerId is null or t.partnerId = :partnerId)
            and (:status is null
                or (:status = 1 and tkp.status in (0, 2) and tkp.startsValidity > :now)
                or (:status = 2 and tkp.status in (0, 2) and tkp.startsValidity <= :now and tkp.expires > :now)
                or (:status = 3 and (tkp.status not in (0, 2) or tkp.expires <= :now))
            )
            and (:fromBuyDate is null or tkp.createdAt between :fromBuyDate and :toBuyDate)
            and (:fromUseDate is null or (tkp.startsValidity >= :fromUseDate and tkp.expires <= :toUseDate))
                        """)
    Page<PartnerSearchHistoryBuyTicketPurchasedResponse> historyBuyTicket(
            String partnerId,
            Long ticketId,
            Integer status,
            LocalDateTime now,
            LocalDateTime fromBuyDate,
            LocalDateTime toBuyDate,
            LocalDateTime fromUseDate,
            LocalDateTime toUseDate,
            Pageable pageable
    );

    @Query("""
            select tp from TicketPurchased tp
            left join Ticket t on t.ticketId = tp.ticketId
            where tp.status in (0, 2) and tp.id = :id
            and (:partnerId is null or t.partnerId = :partnerId)
            """)
    Optional<TicketPurchased> findTicket(String id, String partnerId);
}
