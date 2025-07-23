package com.example.parking_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LinkTicketRequest {
    @NotNull(message = "Thẻ không xác định")
    Long cardId;
    @NotBlank(message = "Vé không xác định")
    String ticketId;
}
