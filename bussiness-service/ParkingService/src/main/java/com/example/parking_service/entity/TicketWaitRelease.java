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
@Table(name = "ticket_wait_release")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketWaitRelease extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    Integer released;

    LocalDateTime releaseAt;

    Long ticketId;

    @Column(nullable = false)
    String partnerId;

    Integer modifyCount;

    String name;

    Integer status;

    String reason;

    Integer vehicle;

    Integer timeSlot;

    Integer daySlot;

    Integer weekSlot;

    Integer monthSlot;

    @Lob
    String description;

    @Column(nullable = false)
    LocalDateTime timeAppliedEdit;

    @Column(nullable = false)
    Integer isDel;
}
