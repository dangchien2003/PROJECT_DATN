package com.example.parking_service.repository;

import com.example.parking_service.dto.response.DoanhThuMotNgay;
import com.example.parking_service.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
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

    Page<Payment> findByPaymentBy(String accountId, Pageable pageable);

    @Query("""
            SELECT sum(p.total) FROM Payment p
            where p.status = 2 and p.createdAt BETWEEN :start AND :end and p.type in :types
            """)
    Long layDoanhThuThang(LocalDateTime start, LocalDateTime end, List<Integer> types);

    @Query("""
            SELECT sum(p.total) FROM Payment p
            where p.status = 2 and p.createdAt BETWEEN :start AND :end and p.type = :type
            """)
    Long laySoTienThanhCongTheoType(LocalDateTime start, LocalDateTime end, Integer type);

    @Query("""
                SELECT
                    new com.example.parking_service.dto.response.DoanhThuMotNgay(
                    FUNCTION('date', p.createdAt),
                    COALESCE(SUM(p.total), 0)
                    )
                FROM Payment p
                WHERE p.type IN :types
                  AND p.status = 2
                  AND p.createdAt BETWEEN :start AND :end
                GROUP BY FUNCTION('date', p.createdAt)
            """)
    List<DoanhThuMotNgay> thongKeDoanhThuThang(LocalDateTime start, LocalDateTime end, List<Integer> types);

}
