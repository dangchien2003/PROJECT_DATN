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
@Table(name = "card")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Card extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String numberCard;

    @Column(nullable = false)
    String accountId;

    Integer issuedTimes;

    LocalDateTime issuedDate;

    LocalDateTime expireDate;

    Integer type;

    Integer status;

    String ticketLink;

    String requestCreateBy;

    String codeActive;
    @Lob
    @Column(columnDefinition = "TEXT", length = 500)
    String reasonRequest;

    String reasonReject;
}
