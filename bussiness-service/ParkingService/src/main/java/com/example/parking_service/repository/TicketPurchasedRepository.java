package com.example.parking_service.repository;

import com.example.parking_service.entity.TicketPurchased;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketPurchasedRepository extends JpaRepository<TicketPurchased, String> {
}
