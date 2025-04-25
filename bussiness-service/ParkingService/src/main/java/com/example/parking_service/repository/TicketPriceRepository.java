package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketPriceRepository extends JpaRepository<TicketPrice, Long> {
    List<TicketPrice> findAllByObjectIdAndTypeAndIsDel(Long objectId, Integer type, Integer isDel);

    List<TicketPrice> findAllByObjectIdInAndTypeAndIsDel(List<Long> objectIds, Integer type, Integer isDel);

    @Query("""
            SELECT e.objectId FROM TicketPrice e
            WHERE e.type = :type and e.priceCategory = :priceCategory
            AND e.isDel = 0 AND e.partnerId = :partnerId
            AND (:price IS NULL OR
                (:trendPrice = 'UP' AND e.price >= :price)
                OR (:trendPrice = 'DOWN' AND e.price <= :price)
                OR (:trendPrice IS NULL AND e.price = :price))
            """)
    List<Long> findAllByTypeAndPriceCategoryAndPrice(
            @Param("type") Integer type,
            @Param("priceCategory") Integer priceCategory,
            @Param("price") Long price,
            @Param("trendPrice") String trendPrice,
            @Param("partnerId") String partnerId
    );
}
