package com.example.parking_service.repository;

import com.example.parking_service.dto.response.CountLocationByTicket;
import com.example.parking_service.entity.TicketLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface TicketLocationRepository extends JpaRepository<TicketLocation, Long> {
    List<TicketLocation> findAllByObjectIdAndTypeAndIsDel(Long objectId, Integer type, Integer isDel);

    boolean existsByObjectIdAndLocationIdAndTypeAndIsDel(Long objectId, Long locationId, Integer type, Integer isDel);

    @Query("""
            SELECT t.objectId FROM TicketLocation t
            WHERE t.locationId IN :locationIds
            AND t.isDel = 0 AND t.type = :type
            """)
    List<Long> findByLocationIdsAndType(
            @Param("locationIds") List<Long> locationIds,
            @Param("type") Integer type
    );

    @Query("""
                select new com.example.parking_service.dto.response.CountLocationByTicket(tl.objectId, count(*)) from TicketLocation tl
                where tl.objectId in :ticketIds and tl.type = :type
                group by tl.objectId
            """)
    List<CountLocationByTicket> countLocationByTicket(Collection<Long> ticketIds, Integer type);
}
