package com.example.parking_service.repository;

import com.example.parking_service.entity.OrderParking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderParking, Long> {
    Optional<OrderParking> findByOrderIdAndPaymentBy(Long orderId, String paymentBy);
}
