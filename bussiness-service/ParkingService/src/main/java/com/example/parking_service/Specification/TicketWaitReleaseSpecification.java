package com.example.parking_service.Specification;

import com.example.parking_service.entity.TicketWaitRelease;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketWaitReleaseSpecification {
    Specification<TicketWaitRelease> partnerSearch(
            String ticketName,
            Integer modifyStatus,
            LocalDateTime releasedTime,
            String trendReleasedTime,
            Integer vehicle,
            List<Long> ids,
            String partnerIds
    );

    Specification<TicketWaitRelease> adminSearch(
            String ticketName,
            Integer modifyStatus,
            LocalDateTime releasedTime,
            String trendReleasedTime,
            Integer vehicle,
            List<Long> ids,
            List<String> partnerIds,
            boolean isCancel
    );
}
