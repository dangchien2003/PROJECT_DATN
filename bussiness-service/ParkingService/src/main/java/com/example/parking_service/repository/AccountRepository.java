package com.example.parking_service.repository;

import com.example.parking_service.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByEmail(String email);

    List<Account> findAllByEmailOrPhoneNumber(String email, String phoneNumber);

    @Query("SELECT a FROM Account a WHERE a.category = :category " +
            "AND (:partnerFullName IS NULL OR a.partnerFullName LIKE CONCAT('%', :partnerFullName, '%') ESCAPE '!') " +
            "AND (:partnerEmail IS NULL OR a.partnerEmail LIKE CONCAT('%', :partnerEmail, '%') ESCAPE '!') " +
            "AND (:partnerPhoneNumber IS NULL OR a.partnerPhoneNumber LIKE CONCAT('%', :partnerPhoneNumber, '%') ESCAPE '!') " +
            "AND (:status IS NULL OR a.status = :status ) "
    )
    Page<Account> searchListPartner(
            @Param("category") Integer category,
            @Param("partnerFullName") String partnerFullName,
            @Param("partnerEmail") String partnerEmail,
            @Param("partnerPhoneNumber") String partnerPhoneNumber,
            @Param("status") Integer status,
            Pageable pageable
    );

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

    Optional<Account> findByIdAndCategory(String id, Integer category);

    Optional<Account> findByPartnerFullNameIgnoreCase(String partnerName);

    @Query("""
                        SELECT a.id from Account a
                        where a.partnerFullName LIKE CONCAT('%', :partnerName, '%') ESCAPE '!'
            """)
    List<String> findAccountIdByPartnerFullName(@Param("partnerName") String partnerName);

    @Query("""
                   SELECT a from Account a where
                   (:keyQuery IS NULL OR
                       a.fullName LIKE CONCAT('%', :keyQuery, '%') ESCAPE '!'
                       OR a.email LIKE CONCAT('%', :keyQuery, '%') ESCAPE '!'
                       or a.phoneNumber LIKE CONCAT('%', :keyQuery, '%') ESCAPE '!'
                   )
                   AND a.status = :status
                   AND a.publicAccount = :publicAccount
            """)
    Page<Account> getSuggestionsByKey(
            @Param("keyQuery") String keyQuery,
            @Param("publicAccount") int publicAccount,
            @Param("status") Integer status,
            Pageable pageable);
}
