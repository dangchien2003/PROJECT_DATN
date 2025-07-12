package com.example.parking_service.repository;

import com.example.parking_service.entity.Deposit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepositRepository extends JpaRepository<Deposit, Long> {
    int countByAccountIdAndStatus(String accountId, Integer status);

    Page<Deposit> findByAccountId(String accountId, Pageable pageable);

    Optional<Deposit> findByIdAndAccountId(Long id, String accountId);
}
