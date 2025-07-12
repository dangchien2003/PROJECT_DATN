package com.example.parking_service.repository;

import com.example.parking_service.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    @Query("""
            select p from Payment p
            where p.paymentBy = :paymentBy
            and (:type is null or p.type = :type)
            and (:createdAtFrom is null or p.createdAt >= :createdAtFrom)
            and (:createdAtTo is null or p.createdAt <= :createdAtTo)
            """)
    Page<Payment> customerSearch(
            @Param("type") Integer type,
            @Param("createdAtFrom") LocalDateTime transactionFrom,
            @Param("createdAtTo") LocalDateTime transactionTo,
            @Param("paymentBy") String paymentBy,
            Pageable pageable
    );

    Optional<Payment> findByObjectIdAndType(String objectId, Integer paymentType);
}
