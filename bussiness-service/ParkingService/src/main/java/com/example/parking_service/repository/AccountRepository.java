package com.example.parking_service.repository;

import com.example.parking_service.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, String> {
    List<Account> findAllByEmailOrPhoneNumber(String email, String phoneNumber);

    @Query("SELECT a FROM Account a WHERE a.category = :category " +
            "AND (:fullName IS NULL OR a.fullName LIKE CONCAT('%', :fullName, '%') ESCAPE '!') " +
            "AND (:email IS NULL OR a.email LIKE CONCAT('%', :email, '%') ESCAPE '!') " +
            "AND (:phoneNumber IS NULL OR a.phoneNumber LIKE CONCAT('%', :phoneNumber, '%') ESCAPE '!') " +
            "AND (:gender IS NULL OR a.gender = :gender ) " +
            "AND (:status IS NULL OR a.status = :status ) " +
            "AND ( :balance IS NULL OR " +
            "   (:balanceTrend = 'UP' AND a.balance >= :balance) " +
            "   OR (:balanceTrend = 'DOWN' AND a.balance <= :balance)" +
            "   OR (:balanceTrend IS NULL AND a.balance = :balance) " +
            ") "
    )
    Page<Account> searchListCustomer(
            @Param("category") Integer category,
            @Param("fullName") String fullName,
            @Param("email") String email,
            @Param("phoneNumber") String phoneNumber,
            @Param("gender") Integer gender,
            @Param("status") Integer status,
            @Param("balance") Long balance,
            @Param("balanceTrend") String balanceTrend,
            Pageable pageable
    );
}
