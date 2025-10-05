package com.example.parking_service.repository;

import com.example.parking_service.dto.response.DoanhThuMotNgay;
import com.example.parking_service.dto.response.DoanhThuMotNgayProjection;
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
            where (:paymentBy is null or p.paymentBy = :paymentBy)
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

    @Query(value = """
            select p.* from Payment p
              left join Order_Parking o on o.order_Id = p.object_Id and p.type = 0
              left join Ticket_Purchased tp on tp.id = p.object_Id and p.type = 1
              left join ticket t on (o.ticket_id = t.ticket_id or tp.ticket_id = t.ticket_id)
            where p.status = 2 and (t.partner_id = :partnerId)
            and (:type is null or p.type = :type)
            and (:createdAtFrom is null or p.created_At >= :createdAtFrom)
            and (:createdAtTo is null or p.created_At <= :createdAtTo)
            """, countQuery = """
                  select count(*) from Payment p
                        left join Order_Parking o on o.order_Id = p.object_Id and p.type = 0
                          left join Ticket_Purchased tp on tp.id = p.object_Id and p.type = 1
                          left join ticket t on (o.ticket_id = t.ticket_id or tp.ticket_id = t.ticket_id)
                        where p.status = 2 and t.partner_id = :partnerId
                        and (:type is null or p.type = :type)
                        and (:createdAtFrom is null or p.created_At >= :createdAtFrom)
                        and (:createdAtTo is null or p.created_At <= :createdAtTo)
            """, nativeQuery = true)
    Page<Payment> partnerSearch(
            @Param("partnerId") String partnerId,
            @Param("type") Integer type,
            @Param("createdAtFrom") LocalDateTime transactionFrom,
            @Param("createdAtTo") LocalDateTime transactionTo,
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


    @Query(value = """
                SELECT
                    DATE(p.created_At) as ngay,
                    COALESCE(SUM(p.total), 0) as doanhThu
                FROM Payment p
                LEFT join Order_Parking op on op.order_Id = p.object_Id and p.type = 0
                LEFT join Ticket_purchased tp on tp.id = p.object_Id and p.type = 1
                LEFT join Ticket t on (
                    (p.type = 0 AND t.ticket_Id = op.ticket_Id) OR
                    (p.type = 1 AND t.ticket_Id = tp.ticket_id)
                )
                WHERE p.type IN :types
                  AND t.partner_Id = :partnerId
                  AND p.status = 2
                  AND p.created_At BETWEEN :start AND :end
                GROUP BY date(p.created_At)
            """, nativeQuery = true)
    List<DoanhThuMotNgayProjection> thongKeDoanhThuThangTheoDoiTac(LocalDateTime start, LocalDateTime end, String partnerId, List<Integer> types);
}
