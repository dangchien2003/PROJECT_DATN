package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketPriceRepository extends JpaRepository<TicketPrice, Long> {
    List<TicketPrice> findAllByObjectIdAndTypeAndIsDel(Long objectId, Integer type, Integer isDel);
}
