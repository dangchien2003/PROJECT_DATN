package com.example.parking_service.repository;

import com.example.parking_service.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, String> {
    Optional<Partner> findByPartnerFullNameIgnoreCase(String partnerFullName);
}
