package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketPurchased;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TicketPurchaseRepository extends JpaRepository<TicketPurchased, String>, JpaSpecificationExecutor<TicketPurchased> {
    @Query("SELECT tp.qrCode from TicketPurchased tp where tp.id = :id and tp.accountId = :owner and status = :status")
    String getQr(@Param("owner") String owner, @Param("id") String id, @Param("status") Integer status);

    Optional<TicketPurchased> findByIdAndAccountIdAndStatus(String id, String owner, Integer status);

    Optional<TicketPurchased> findByIdAndAccountId(String id, String accountId);

    boolean existsByIdAndAccountId(String id, String accountId);

}
