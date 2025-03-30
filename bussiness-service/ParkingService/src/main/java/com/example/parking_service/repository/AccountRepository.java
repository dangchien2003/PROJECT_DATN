package com.example.parking_service.repository;

import com.example.parking_service.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findAllByEmail(String email);
}
