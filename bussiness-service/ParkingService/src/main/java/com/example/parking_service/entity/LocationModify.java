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
@Table(name = "location_modify")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LocationModify extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long modifyId;

    @Column(nullable = false)
    Long locationId;

    @Column(nullable = false)
    String partnerId;

    String name;

    @Column(nullable = false)
    Integer modifyCount;

    String coordinates;

    String linkGoogleMap;

    String avatar;

    String videoTutorial;

    Integer status;

    Integer modifyStatus;

    String reason;

    LocalDateTime openTime;

    LocalDateTime closeTime;

    String openDate;

    Integer openHoliday;

    LocalDateTime timeAppliedEdit;

    Integer urgentApprovalRequest;

    Long capacity;

    @Lob
    String description;

    @Lob
    String infoLocation;

    @Lob
    String modifyDescription;
}
