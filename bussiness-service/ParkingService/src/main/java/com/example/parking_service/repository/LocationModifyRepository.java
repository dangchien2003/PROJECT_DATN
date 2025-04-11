package com.example.parking_service.repository;

import com.example.parking_service.dto.response.AdminSearchLocationWaitApproveResponse;
import com.example.parking_service.entity.LocationModify;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

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
            "WHERE lm.isDel = :isDel AND lm.partnerId = :partnerId AND lm.modifyStatus = :modifyStatus " +
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
            "AND (:urgentApprovalRequest IS NULL OR lm.urgentApprovalRequest = :urgentApprovalRequest) " +
            "AND (:modifyStatus <> 2 OR :modifyStatus = 2 AND lm.timeAppliedEdit > :now) "
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
            @Param("now") LocalDateTime now,
            @Param("partnerId") String partnerId,
            @Param("isDel") Integer isDel,
            Pageable pageable
    );

    @Query(
            value = "SELECT " +
                    "   lm.modify_id as modifyId, " +
                    "   lm.location_id as locationId, " +
                    "   lm.name as name, " +
                    "   lm.status as status, " +
                    "   lm.modify_status as modifyStatus, " +
                    "   lm.created_at as createdAt, " +
                    "   lm.time_applied_edit as timeAppliedEdit, " +
                    "   a.partner_full_name as partnerFullName " +
                    "FROM location_modify lm " +
                    "LEFT JOIN account a ON a.id = lm.partner_id " +
                    "WHERE lm.is_del = :isDel AND lm.modify_status = :modifyStatus " +
                    "AND (:category IS NULL OR (:category = 1 AND lm.location_id IS NULL) OR (:category = 2 AND lm.location_id IS NOT NULL))" +
                    "AND (:partnerName IS NULL OR a.partner_full_name LIKE CONCAT('%', :partnerName, '%') ESCAPE '!') " +
                    "AND (:urgentApprovalRequest IS NULL OR lm.urgent_approval_request = :urgentApprovalRequest) " +
                    "AND ( :applyTime IS NULL OR " +
                    "   (:trendApplyTime = 'UP' AND lm.time_applied_edit >= :applyTime) " +
                    "   OR (:trendApplyTime = 'DOWN' AND lm.time_applied_edit <= :applyTime)" +
                    "   OR (:trendApplyTime IS NULL AND lm.time_applied_edit = :applyTime) " +
                    ") " +
                    "AND ( :createdTime IS NULL OR " +
                    "   (:trendCreatedTime = 'UP' AND lm.created_at >= :createdTime) " +
                    "   OR (:trendCreatedTime = 'DOWN' AND lm.created_at <= :createdTime)" +
                    "   OR (:trendCreatedTime IS NULL AND lm.created_at = :createdTime) " +
                    ") " +
                    "LIMIT :limit OFFSET :offset ",
            nativeQuery = true
    )
    List<AdminSearchLocationWaitApproveResponse> adminSearch(
            @Param("category") Integer category,
            @Param("partnerName") String partnerName,
            @Param("modifyStatus") Integer modifyStatus,
            @Param("urgentApprovalRequest") Integer urgentApprovalRequest,
            @Param("applyTime") LocalDateTime applyTime,
            @Param("trendApplyTime") String trendApplyTime,
            @Param("createdTime") LocalDateTime createdTime,
            @Param("trendCreatedTime") String trendCreatedTime,
            @Param("isDel") Integer isDel,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Query("SELECT count(*) FROM LocationModify lm " +
            "WHERE lm.isDel = :isDel AND lm.modifyStatus = :modifyStatus " +
            "AND (:category IS NULL OR (:category = 1 AND lm.locationId IS NULL) OR (:category = 2 AND lm.locationId IS NOT NULL))"
    )
    Long countAllRecord(
            @Param("category") Integer category,
            @Param("modifyStatus") Integer modifyStatus,
            @Param("isDel") Integer isDel
    );

    Optional<LocationModify> findByModifyIdAndIsDel(Long locationId, Integer isDel);
}
