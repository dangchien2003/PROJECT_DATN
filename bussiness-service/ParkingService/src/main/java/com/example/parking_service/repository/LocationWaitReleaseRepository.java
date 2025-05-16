package com.example.parking_service.repository;

import com.example.parking_service.entity.LocationWaitRelease;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface LocationWaitReleaseRepository extends JpaRepository<LocationWaitRelease, Long> {
    @Query(value = "SELECT lwr FROM LocationWaitRelease lwr where " +
            "((:locationId IS NULL OR lwr.locationId = :locationId) " +
            "OR (:modifyId IS NULL OR lwr.modifyId = :modifyId)) " +
            "AND lwr.isDel = :isDel AND lwr.released  = :release"
    )
    List<LocationWaitRelease> findRecord(
            @Param("locationId") Long locationId,
            @Param("modifyId") Long modifyId,
            @Param("isDel") Integer isDel,
            @Param("release") Integer release
    );

    @Query("SELECT lwr FROM LocationWaitRelease lwr " +
            "WHERE lwr.partnerId = :partnerId AND lwr.status = :status AND lwr.isDel = :isDel AND lwr.released = :released " +
            "AND (:name IS NULL OR lwr.name LIKE CONCAT('%', :name, '%') ESCAPE '!') " +
            "AND (:openTime IS NULL OR lwr.openTime = :openTime) " +
            "AND (:closeTime IS NULL OR lwr.closeTime = :closeTime) " +
            "AND (:openHoliday IS NULL OR lwr.openHoliday = :openHoliday) "
    )
    Page<LocationWaitRelease> partnerSearch(
            @Param("name") String name,
            @Param("openTime") LocalTime openTime,
            @Param("closeTime") LocalTime closeTime,
            @Param("openHoliday") Integer openHoliday,
            @Param("status") Integer status,
            @Param("partnerId") String partnerId,
            @Param("isDel") Integer isDel,
            @Param("released") Integer released,
            Pageable pageable
    );

    Optional<LocationWaitRelease> findByIdAndIsDel(Long id, Integer isDel);

    @Query(value = """
                SELECT lwr FROM LocationWaitRelease lwr 
                WHERE lwr.isDel = :isDel AND lwr.released = :released 
                AND lwr.timeAppliedEdit BETWEEN :from AND :to
            """)
    List<LocationWaitRelease> findAllRecordWaitReleaseThisHour(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            @Param("isDel") Integer isDel,
            @Param("released") Integer released
    );
}
