package com.example.parking_service.repository;

import com.example.parking_service.entity.LocationModify;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;

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

    @Query("SELECT lm FROM LocationModify lm " +
            "WHERE lm.isDel = 1 AND lm.partnerId = :partnerId AND lm.modifyStatus = :modifyStatus " +
            "AND (:category IS NULL OR (:category = 1 AND lm.locationId IS NULL) OR (:category = 2 AND lm.locationId IS NOT NULL))" +
            "AND (:name IS NULL OR lm.name LIKE CONCAT('%', :name, '%') ESCAPE '!') " +
            "AND (:openTime IS NULL OR lm.openTime = :openTime) " +
            "AND (:closeTime IS NULL OR lm.closeTime = :closeTime) " +
            "AND (:openHoliday IS NULL OR lm.openHoliday = :openHoliday) " +
            "AND ( :applyDate IS NULL OR " +
            "   (:trendApplyDate = 'UP' AND lm.timeAppliedEdit >= :applyDate) " +
            "   OR (:trendApplyDate = 'DOWN' AND lm.timeAppliedEdit <= :applyDate)" +
            "   OR (:trendApplyDate IS NULL AND lm.timeAppliedEdit = :applyDate) " +
            ") " +
            "AND (:fromRequestDate IS NULL OR lm.createdAt >= :fromRequestDate) " +
            "AND (:endRequestDate IS NULL OR lm.createdAt <= :endRequestDate) " +
            "AND (:urgentApprovalRequest IS NULL OR lm.urgentApprovalRequest = :urgentApprovalRequest) "
    )
    Page<LocationModify> partnerSearch(
            @Param("category") Integer category,
            @Param("name") String name,
            @Param("openTime") LocalTime openTime,
            @Param("closeTime") LocalTime closeTime,
            @Param("openHoliday") Integer openHoliday,
            @Param("modifyStatus") Integer modifyStatus,
            @Param("applyDate") LocalDateTime applyDate,
            @Param("trendApplyDate") String trendApplyDate,
            @Param("fromRequestDate") LocalDateTime fromRequestDate,
            @Param("endRequestDate") LocalDateTime endRequestDate,
            @Param("urgentApprovalRequest") Integer urgentApprovalRequest,
            @Param("partnerId") String partnerId,
            Pageable pageable
    );
}
