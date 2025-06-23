package com.example.parking_service.repository;

import com.example.parking_service.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    boolean existsByTicketIdAndStatusIn(Long id, List<Integer> status);
}
