package com.example.parking_service.repository;

import com.example.parking_service.entity.LocationModify;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LocationModifyRepository extends JpaRepository<LocationModify, Long> {
    //    @Query("SELECT lm " +
//            "FROM LocationModify lm " +
//            "WHERE UPPER(lm.name) = UPPER(:name) " +
//            "AND lm.modifyStatus <> :ignoreModifyStatus " +
//            "AND :locationId IS NULL OR lm.locationId <> :locationId " +
//    )
//    Optional<Location> checkDuplicateName(
//            @Param("name") String name,
//            @Param("ignoreModifyStatus") Integer ignoreModifyStatus,
//            @Param("locationId") Integer locationId
//    );
    @Query("SELECT MAX(lm.modifyStatus) FROM LocationModify lm WHERE lm.locationId = :locationId")
    Integer getMaxModifyCountByLocationId(@Param("locationId") Long locationId);
}
