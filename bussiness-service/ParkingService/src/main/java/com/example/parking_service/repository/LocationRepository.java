package com.example.parking_service.repository;

import com.example.parking_service.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
    @Query("SELECT l FROM Location l " +
            "WHERE l.partnerId = :partnerId AND l.status = :status and l.isDel = :isDel " +
            "AND (:name IS NULL OR l.name LIKE CONCAT('%', :name, '%') ESCAPE '!') " +
            "AND (:openTime IS NULL OR l.openTime = :openTime) " +
            "AND (:closeTime IS NULL OR l.closeTime = :closeTime) " +
            "AND (:openHoliday IS NULL OR l.openHoliday = :openHoliday) "
    )
    Page<Location> partnerSearch(
            @Param("name") String name,
            @Param("openTime") LocalTime openTime,
            @Param("closeTime") LocalTime closeTime,
            @Param("openHoliday") Integer openHoliday,
            @Param("status") Integer status,
            @Param("partnerId") String partnerId,
            @Param("isDel") Integer isDel,
            Pageable pageable
    );

    //    @Query("SELECT lm " +
//            "FROM Location lm " +
//            "WHERE UPPER(lm.name) = UPPER(:name) " +
//            "AND lm.modifyStatus <> :ignoreModifyStatus " +
//            "AND :locationId IS NULL OR lm.locationId <> :locationId " +
//    )
//    Optional<Location> checkDuplicateName(
//            @Param("name") String name,
//            @Param("ignoreModifyStatus") Integer ignoreModifyStatus,
//            @Param("locationId") Integer locationId
//    );
    @Query("SELECT MAX(lm.modifyStatus) FROM Location lm WHERE lm.locationId = :locationId")
    Integer getMaxModifyCountByLocationId(@Param("locationId") Long locationId);

    @Query("SELECT l FROM Location l WHERE " +
            "l.locationId = :locationId " +
            "AND l.isDel = :isDel " +
            "AND l.modifyStatus = :modifyStatus " +
            "AND l.modifyCount = MAX(l.modifyCount)")
    Optional<Location> findByLocationIdAndIsDel(String locationId, Long isDel, Long modifyStatus);

    Optional<Location> findByLocationIdAndIsDel(Long locationId, Integer isDel);
}
