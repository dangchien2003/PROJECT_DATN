package com.example.parking_service.repository;

import com.example.parking_service.entity.Card;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    @Query("SELECT MAX(c.issuedTimes) FROM Card c where c.accountId = :owner")
    Integer getMaxIssuedTimesByOwner(String owner);

    Page<Card> findByAccountId(String accountId, Pageable pageable);

    Page<Card> findByAccountIdAndStatusNotIn(String accountId, List<Integer> statusNotGet, Pageable pageable);
}
