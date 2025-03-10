package com.example.parking_service.entity;


import com.example.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    String id;

    @Column(nullable = false)
    String accountId;

    @Column(nullable = false)
    Long ticketId;

    Long price;

    Long priceExtend;

    Integer extendCount;

    Integer status;

    String reason;

    LocalDateTime startsValidity;

    LocalDateTime expires;

    String qrCode;

    Integer createdQrCodeCount;

    String contentPlate;

    Integer permitEditContentPlate;
}
