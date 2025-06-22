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
@Table(name = "ticket_modify")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketModify extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long modifyId;

    @Column(nullable = false)
    Long ticketId;

    @Column(nullable = false)
    String partnerId;

    Integer modifyCount;

    String name;

    Integer status;

    Integer modifyStatus;

    String reason;

    LocalDateTime timeAppliedEdit;

    Integer urgentApprovalRequest;

    Integer vehicle;

    Integer timeSlot;

    Long priceTimeSlot;

    Long priceDaySlot;

    Long priceWeekSlot;

    Long priceMonthSlot;

    @Lob
    String modifyDescription;
}
