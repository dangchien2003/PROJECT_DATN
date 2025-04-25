package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketLocationRepository extends JpaRepository<TicketLocation, Long> {
    List<TicketLocation> findAllByObjectIdAndTypeAndIsDel(Long objectId, Integer type, Integer isDel);

    @Query("""
            SELECT t.objectId FROM TicketLocation t
            WHERE t.objectId IN :objectIds
            AND t.isDel = 0 AND t.type = :type AND t.partnerId = :partnerId
            """)
    List<Long> findByObjectIdAndTypeAndPartnerId(
            @Param("objectIds") List<Long> objectIds,
            @Param("type") Integer type,
            @Param("partnerId") String partnerId
    );
}
