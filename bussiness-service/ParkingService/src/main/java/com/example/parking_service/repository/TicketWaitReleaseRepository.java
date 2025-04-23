package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketWaitRelease;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketWaitReleaseRepository extends JpaRepository<TicketWaitRelease, Long> {
    Optional<TicketWaitRelease> findByTicketIdAndIsDelAndReleased(Long ticketId, Integer isDel, Integer release);

    boolean existsByTicketIdAndIsDelAndReleased(Long ticketId, Integer isDel, Integer released);
}
