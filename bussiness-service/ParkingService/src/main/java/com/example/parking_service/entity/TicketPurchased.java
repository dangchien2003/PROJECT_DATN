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
@Table(name = "ticket_purchased")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketPurchased extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(nullable = false)
    String accountId;

    @Column(nullable = false)
    Long ticketId;

    @Column(nullable = false)
    Long locationId;

    Long price;

    Integer timeExtend;

    Integer timeUnitExtend;

    @Column(columnDefinition = "0")
    Long priceExtend;

    @Column(columnDefinition = "0")
    Integer extendCount;

    Integer status;

    String reason;

    @Column(nullable = false)
    Integer useStatus;

    @Column(columnDefinition = "0")
    Long usedTimes;

    LocalDateTime startsValidity;

    LocalDateTime expires;

    String qrCode;

    Integer createdQrCodeCount;

    String contentPlate;

    Integer permitEditContentPlate;
}
