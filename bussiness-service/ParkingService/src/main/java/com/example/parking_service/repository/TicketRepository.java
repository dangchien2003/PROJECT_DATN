package com.example.parking_service.repository;

import com.example.parking_service.entity.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query(value = """
               SELECT t FROM Ticket t
               WHERE t.status = :status AND t.partnerId = :partnerId
               AND (:ticketName IS NULL OR t.name LIKE CONCAT('%', :ticketName, '%') ESCAPE '!')
               AND (:modifyStatus IS NULL OR t.modifyStatus = :modifyStatus)
               AND (:releasedTime IS NULL
                   OR (:trendReleasedTime = 'UP' AND t.releasedTime >= :releasedTime)
                   OR (:trendReleasedTime = 'DOWN' AND t.releasedTime <= :releasedTime)
                   OR (:trendReleasedTime IS NULL AND t.releasedTime = :releasedTime))
               AND (:vehicle IS NULL OR t.vehicle = :vehicle)
               AND (:ids IS NULL OR t.ticketId in :ids)
            """)
    Page<Ticket> partnerSearch(
            @Param("ticketName") String ticketName,
            @Param("status") Integer status,
            @Param("modifyStatus") Integer modifyStatus,
            @Param("releasedTime") LocalDateTime releasedTime,
            @Param("trendReleasedTime") String trendReleasedTime,
            @Param("vehicle") Integer vehicle,
            @Param("ids") List<Long> ids,
            @Param("partnerId") String partnerId,
            Pageable pageable
    );

    @Query(value = """
               SELECT t FROM Ticket t
               WHERE t.status = :status
               AND (:partnerIds IS NULL OR t.partnerId in :partnerIds)
               AND (:ticketName IS NULL OR t.name LIKE CONCAT('%', :ticketName, '%') ESCAPE '!')
               AND (:modifyStatus IS NULL OR t.modifyStatus = :modifyStatus)
               AND (:releasedTime IS NULL
                   OR (:trendReleasedTime = 'UP' AND t.releasedTime >= :releasedTime)
                   OR (:trendReleasedTime = 'DOWN' AND t.releasedTime <= :releasedTime)
                   OR (:trendReleasedTime IS NULL AND t.releasedTime = :releasedTime))
               AND (:vehicle IS NULL OR t.vehicle = :vehicle)
               AND (:ids IS NULL OR t.ticketId in :ids)
            """)
    Page<Ticket> adminSearch(
            @Param("ticketName") String ticketName,
            @Param("status") Integer status,
            @Param("modifyStatus") Integer modifyStatus,
            @Param("releasedTime") LocalDateTime releasedTime,
            @Param("trendReleasedTime") String trendReleasedTime,
            @Param("vehicle") Integer vehicle,
            @Param("ids") List<Long> ids,
            @Param("partnerIds") List<String> partnerId,
            Pageable pageable
    );
}
