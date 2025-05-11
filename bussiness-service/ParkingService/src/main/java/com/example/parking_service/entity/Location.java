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
import java.time.LocalTime;

@Entity
@Table(name = "location")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Location extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long locationId;

    @Column(nullable = false)
    String partnerId;

    String name;

    String address;

    @Column(nullable = false)
    Integer modifyCount;

    String coordinates;

    @Lob
    @Column(columnDefinition = "TEXT")
    String linkGoogleMap;

    String avatar;

    String videoTutorial;

    Integer status;

    Integer modifyStatus;

    String reasonChangeStatus;

    LocalTime openTime;

    LocalTime closeTime;

    LocalDateTime openDate;

    Integer openHoliday;

    Long capacity;

    String approveBy;

    @Lob
    String description;

    @Lob
    String infoLocation;
}
