package com.example.parking_service.repository;

import com.example.parking_service.entity.Card;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    @Query("SELECT MAX(c.issuedTimes) FROM Card c where c.accountId = :owner")
    Integer getMaxIssuedTimesByOwner(String owner);

    Page<Card> findByAccountId(String accountId, Pageable pageable);

    Optional<Card> findByIdAndAccountId(Long id, String accountId);

    Page<Card> findByAccountIdAndStatusNotIn(String accountId, List<Integer> statusNotGet, Pageable pageable);

    @Query("""
            SELECT c from Card c
            left join Account a on a.id = c.accountId
            left join Account rq on rq.id = c.requestCreateBy
            where c.status = :status 
            and (:emailOwner is null or a.email like concat('%', :emailOwner, '%') escape '!') 
            and (:numberCard is null or c.numberCard like concat('%', :numberCard, '%') escape '!') 
            and (:requestName is null or rq.fullName like concat('%', :requestName, '%') escape '!') 
            and (:issuedDateFrom is null or (c.issuedDate >= :issuedDateFrom and c.issuedDate <= :issuedDateTo)) 
            and (:type is null or c.type = :type) 
            """)
    Page<Card> adminSearch(
            String emailOwner,
            String numberCard,
            String requestName,
            LocalDateTime issuedDateFrom,
            LocalDateTime issuedDateTo,
            Integer status,
            Integer type,
            Pageable pageable
    );

    @Query("""
            SELECT c from Card c
            left join Account a on a.id = c.accountId
            left join Account rq on rq.id = c.requestCreateBy
            where c.status = :status
            and (:emailOwner is null or a.email like concat('%', :emailOwner, '%') escape '!') 
            and (:requestName is null or rq.fullName like concat('%', :requestName, '%') escape '!') 
            and (:requestDateFrom is null or (c.createdAt >= :requestDateFrom and c.createdAt <= :requestDateTo)) 
            and (:type is null or c.type = :type) 
            """)
    Page<Card> adminSearchRequestAdd(
            String emailOwner,
            String requestName,
            LocalDateTime requestDateFrom,
            LocalDateTime requestDateTo,
            Integer status,
            Integer type,
            Pageable pageable
    );
}
