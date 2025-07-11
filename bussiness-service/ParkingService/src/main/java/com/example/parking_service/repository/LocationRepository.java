package com.example.parking_service.repository;

import com.example.parking_service.dto.response.AdminSearchLocationResponse;
import com.example.parking_service.dto.response.LocationNameDTO;
import com.example.parking_service.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
    @Query("SELECT l FROM Location l " +
            "WHERE l.partnerId = :partnerId AND l.status = :status " +
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
            Pageable pageable
    );

    @Query("SELECT MAX(lm.modifyStatus) FROM Location lm WHERE lm.locationId = :locationId")
    Integer getMaxModifyCountByLocationId(@Param("locationId") Long locationId);

    @Query("SELECT l FROM Location l WHERE " +
            "l.locationId = :locationId " +
            "AND l.modifyStatus = :modifyStatus " +
            "AND l.modifyCount = MAX(l.modifyCount)")
    Optional<Location> findByLocationId(String locationId, Long modifyStatus);

    Optional<Location> findByLocationIdAndPartnerId(Long locationId, String partnerId);

    @Query(value = "SELECT " +
            "   l.location_id as locationId, " +
            "   l.name as name, " +
            "   l.coordinatesX as coordinatesX, " +
            "   l.coordinatesY as coordinatesY, " +
            "   l.link_google_map as linkGoogleMap, " +
            "   l.status as status, " +
            "   l.modify_status as modifyStatus, " +
            "   l.open_date as openDate, " +
            "   l.capacity as capacity " +
            "FROM location l " +
            "LEFT JOIN account a ON a.id = l.partner_id " +
            "WHERE l.status = :status " +
            "AND (:partnerName IS NULL OR a.partner_full_name LIKE CONCAT('%', :partnerName, '%') ESCAPE '!') " +
            "AND (:locationName IS NULL OR l.name LIKE CONCAT('%', :locationName, '%') ESCAPE '!') " +
            "AND (:openTime IS NULL OR l.open_time = :openTime) " +
            "AND (:closeTime IS NULL OR l.close_time = :closeTime) " +
            "AND (:capacity IS NULL OR l.capacity = :capacity) " +
            "AND (:openHoliday IS NULL OR l.open_holiday = :openHoliday) " +
            "LIMIT :limit OFFSET :offset ",
            nativeQuery = true
    )
    List<AdminSearchLocationResponse> adminSearch(
            @Param("status") Integer status,
            @Param("partnerName") String partnerName,
            @Param("locationName") String locationName,
            @Param("openTime") LocalTime openTime,
            @Param("closeTime") LocalTime closeTime,
            @Param("capacity") Long capacity,
            @Param("openHoliday") Integer openHoliday,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    Page<Location> findAllByStatusAndCoordinatesXNotNullAndCoordinatesYNotNull(Integer status, Pageable pageable);

    Page<Location> findAllByStatusAndPartnerId(Integer status, String partnerId, Pageable pageable);

    Long countByPartnerIdAndStatusAndLocationIdIn(String partnerId, Integer status, List<Long> locationIds);

    @Query("""
            SELECT l.locationId FROM Location l
            WHERE (:partnerIds IS NULL OR l.partnerId in :partnerIds)
            AND l.name LIKE CONCAT('%', :name, '%') ESCAPE '!'
            """)
    List<Long> findAllByNameAndPartnerId(
            @Param("name") String name,
            @Param("partnerIds") List<String> partnerIds);

    @Query("""
            SELECT l FROM Location l
            WHERE
            (:name is null or l.name LIKE CONCAT('%', :name, '%') ESCAPE '!')
            and l.status = :status
            """)
    Page<Location> customerSearch(
            @Param("name") String name,
            @Param("status") Integer status,
            Pageable pageable);

    Page<Location> findByLocationIdInAndStatusIn(
            List<Long> ids,
            List<Integer> statusList,
            Pageable pageable);

    Optional<Location> findByLocationIdAndStatus(Long locationId, Integer status);

    @Query("SELECT l.locationId from Location l where l.name LIKE CONCAT('%', :name, '%') ESCAPE '!'")
    List<Long> getListIdByName(@Param("name") String name);

    @Query(""" 
            select new com.example.parking_service.dto.response.LocationNameDTO(l.locationId, l.name, l.address) 
            from Location l
            where l.locationId in(:ids)
            """)
    List<LocationNameDTO> getNameDto(@Param("ids") List<Long> ids);
}
