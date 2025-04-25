package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketWaitRelease;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TicketWaitReleaseRepository extends JpaRepository<TicketWaitRelease, Long> {
    Optional<TicketWaitRelease> findByTicketIdAndIsDelAndReleased(Long ticketId, Integer isDel, Integer release);

    boolean existsByTicketIdAndIsDelAndReleased(Long ticketId, Integer isDel, Integer released);

    @Query(value = """
               SELECT t FROM TicketWaitRelease t
               WHERE t.status = :status AND t.partnerId = :partnerId
               AND (:ticketName IS NULL OR t.name LIKE CONCAT('%', :ticketName, '%') ESCAPE '!')
               AND (:modifyStatus IS NULL
                   OR (:modifyStatus = 0 AND t.released = 0 AND t.isDel = 0)
                   OR (:modifyStatus = 1 AND t.rejectBy IS NULL AND t.isDel = 1)
                   OR (:modifyStatus = 2 AND t.rejectBy IS NOT NULL AND t.isDel = 1)
                   OR (:modifyStatus = 3 AND t.released = 1 AND t.isDel = 0)
                    )
               AND (:releasedTime IS NULL
                   OR (:trendReleasedTime = 'UP' AND t.timeAppliedEdit >= :releasedTime)
                   OR (:trendReleasedTime = 'DOWN' AND t.timeAppliedEdit <= :releasedTime)
                   OR (:trendReleasedTime IS NULL AND t.timeAppliedEdit = :releasedTime))
               AND (:vehicle IS NULL OR t.vehicle = :vehicle)
               AND (:ids IS NULL OR t.id in :ids)
            """)
    List<TicketWaitRelease> partnerSearch(
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
}
