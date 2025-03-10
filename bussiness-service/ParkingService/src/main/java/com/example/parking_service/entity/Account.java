package com.example.parking_service.entity;


import com.example.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account extends BaseEntity {

    @Id
    @Column(nullable = false, unique = true)
    String id;

    String fullName;

    Integer gender;

    @Column(nullable = false, unique = true)
    String email;

    String phoneNumber;

    @Column(nullable = false)
    String password;

    Integer permitChangePassword;

    Integer status;

    String reason;

    Integer category;

    String avatar;

    Long balance;

    @OneToMany
    List<Role> roles;
}
