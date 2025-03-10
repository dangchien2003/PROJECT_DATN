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

@Entity
@Table(name = "partner")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Partner extends BaseEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String accountId;

    @Column(nullable = false)
    private String partnerFullName;

    private String representativeFullName;

    private String phoneNumber;

    @Column(nullable = false, unique = true)
    private String email;

    private String address;
}