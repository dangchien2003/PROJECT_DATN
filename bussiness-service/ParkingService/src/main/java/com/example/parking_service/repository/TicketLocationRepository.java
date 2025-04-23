package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketLocationRepository extends JpaRepository<TicketLocation, Long> {
    List<TicketLocation> findAllByObjectIdAndTypeAndIsDel(Long objectId, Integer type, Integer isDel);
}
