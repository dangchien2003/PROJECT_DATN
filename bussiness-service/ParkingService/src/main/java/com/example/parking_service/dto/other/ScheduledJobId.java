package com.example.parking_service.dto.other;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduledJobId {
    String module;
    String id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ScheduledJobId that = (ScheduledJobId) o;
        return Objects.equals(module, that.module) && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(module, id);
    }
}
