package com.example.parking_service.entity;

import com.example.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderParking extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long orderId;

    String extendTicketId;

    Long total;

    Integer status;

    Integer qualityTicket;

    @Column(columnDefinition = "TEXT")
    String owners;

    Long locationId;

    Long ticketId;

    Long price;

    Integer ticketCategory;

    Integer quality;

    LocalDateTime start;

    LocalDateTime expire;

    String paymentBy;
}
