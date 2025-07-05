package com.example.parking_service.repository;

import com.example.parking_service.dto.response.TicketNameDTO;
import com.example.parking_service.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    boolean existsByTicketIdAndStatusIn(Long id, List<Integer> status);

    Optional<Ticket> findByTicketIdAndStatusIn(Long ticketId, List<Integer> status);

    @Query("SELECT new com.example.parking_service.dto.response.TicketNameDTO(t.ticketId, t.name) " +
            "FROM Ticket t WHERE t.ticketId IN :ticketIds")
    List<TicketNameDTO> findDTOByTicketIdIn(@Param("ticketIds") List<Long> ids);
}
