package com.example.parking_service.dto.response;


import com.example.common.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SearchListCustomerResponse extends BaseEntity {
    String id;
    String fullName;
    Integer gender;
    String email;
    String phoneNumber;
    Integer permitChangePassword;
    Integer status;
    String reason;
    Integer category;
    String avatar;
    Long balance;
}
