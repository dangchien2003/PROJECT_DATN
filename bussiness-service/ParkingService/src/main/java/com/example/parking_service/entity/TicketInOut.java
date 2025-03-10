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
@Table(name = "ticket_in_out")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketInOut extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String ticketPurchasedId;

    @Column(nullable = false)
    String numberCard;

    LocalDateTime checkinAt;

    Integer checkinMethod;

    String contentPlateIn;

    String imagePlateIn;

    String imageVehicleIn;

    LocalDateTime checkoutAt;

    Integer checkoutMethod;

    String contentPlateOut;

    String imagePlateOut;

    String imageVehicleOut;

    Long locationId;

    String position;
}
