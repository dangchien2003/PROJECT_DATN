package com.example.parking_service.Specification.impl;

import com.example.common.enums.IsDel;
import com.example.common.enums.Release;
import com.example.parking_service.Specification.TicketWaitReleaseSpecification;
import com.example.parking_service.entity.TicketWaitRelease;
import com.example.parking_service.entity.TicketWaitRelease_;
import com.example.parking_service.utils.SpecificationUtils;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class TicketWaitReleaseSpecificationImpl implements TicketWaitReleaseSpecification {
    public Specification<TicketWaitRelease> partnerSearch(
            String ticketName,
            Integer modifyStatus,
            LocalDateTime releasedTime,
            String trendReleasedTime,
            Integer vehicle,
            List<Long> ids,
            @NotNull String partnerId,
            Long price,
            String trendPrice,
            Integer priceCategory
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // partnerId
            predicates.add(cb.equal(root.get(TicketWaitRelease_.partnerId), partnerId));

            // ticketName LIKE
            if (ticketName != null) {
                predicates.add(cb.like(root.get(TicketWaitRelease_.name), "%" + ticketName + "%", '!'));
            }

            // modifyStatus logic
            if (modifyStatus != null) {
                switch (modifyStatus) {
                    case 0 -> predicates.add(cb.and(
                            cb.equal(root.get(TicketWaitRelease_.released), Release.RELEASE_NOT_YET.getValue()),
                            cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETE_NOT_YET.getValue())
                    ));
                    case 1 -> predicates.add(cb.and(
                            cb.isNull(root.get(TicketWaitRelease_.rejectBy)),
                            cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETED.getValue())
                    ));
                    case 2 -> predicates.add(cb.and(
                            cb.isNotNull(root.get(TicketWaitRelease_.rejectBy)),
                            cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETED.getValue())
                    ));
                    case 3 -> predicates.add(cb.and(
                            cb.equal(root.get(TicketWaitRelease_.released), Release.RELEASE.getValue()),
                            cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETE_NOT_YET.getValue())
                    ));
                }
            }

            // releasedTime + trend
            if (releasedTime != null) {
                if ("UP".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get(TicketWaitRelease_.timeAppliedEdit), releasedTime));
                } else if ("DOWN".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.lessThanOrEqualTo(root.get(TicketWaitRelease_.timeAppliedEdit), releasedTime));
                } else {
                    predicates.add(cb.equal(root.get(TicketWaitRelease_.timeAppliedEdit), releasedTime));
                }
            }

            // vehicle
            if (vehicle != null) {
                predicates.add(cb.equal(root.get(TicketWaitRelease_.vehicle), vehicle));
            }

            // ids IN
            if (ids != null) {
                predicates.add(root.get(TicketWaitRelease_.id).in(ids));
            }

            // price
            if (price != null) {
                String field = SpecificationUtils.getFieldPriceString(priceCategory);
                if ("UP".equalsIgnoreCase(trendPrice)) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get(field), price));
                } else if ("DOWN".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.lessThanOrEqualTo(root.get(field), price));
                } else {
                    predicates.add(cb.equal(root.get(field), price));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    public Specification<TicketWaitRelease> adminSearch(
            String ticketName,
            Integer modifyStatus,
            LocalDateTime releasedTime,
            String trendReleasedTime,
            Integer vehicle,
            List<Long> ids,
            List<String> partnerIds,
            Long price,
            String trendPrice,
            Integer priceCategory,
            boolean isCancel
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            // partnerIds IN
            if (partnerIds != null) {
                predicates.add(root.get(TicketWaitRelease_.partnerId).in(partnerIds));
            }
            // isCancel
            if (isCancel) {
                predicates.add(cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETED.getValue()));
            } else {
                predicates.add(cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETE_NOT_YET.getValue()));
            }
            // ticketName LIKE
            if (ticketName != null) {
                predicates.add(cb.like(root.get(TicketWaitRelease_.name), "%" + ticketName + "%", '!'));
            }
            // modifyStatus
            if (modifyStatus != null) {
                if (modifyStatus.equals(0)) {
                    predicates.add(cb.equal(root.get(TicketWaitRelease_.released), Release.RELEASE_NOT_YET.getValue()));
                    predicates.add(cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETE_NOT_YET.getValue()));
                } else if (modifyStatus.equals(1)) {
                    predicates.add(cb.isNull(root.get(TicketWaitRelease_.rejectBy)));
                    predicates.add(cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETED.getValue()));
                } else if (modifyStatus.equals(2)) {
                    predicates.add(cb.isNotNull(root.get(TicketWaitRelease_.rejectBy)));
                    predicates.add(cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETED.getValue()));
                } else if (modifyStatus.equals(3)) {
                    predicates.add(cb.equal(root.get(TicketWaitRelease_.released), Release.RELEASE.getValue()));
                    predicates.add(cb.equal(root.get(TicketWaitRelease_.isDel), IsDel.DELETE_NOT_YET.getValue()));
                }
            }
            // releasedTime
            if (releasedTime != null) {
                if ("UP".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get(TicketWaitRelease_.timeAppliedEdit), releasedTime));
                } else if ("DOWN".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.lessThanOrEqualTo(root.get(TicketWaitRelease_.timeAppliedEdit), releasedTime));
                } else {
                    predicates.add(cb.equal(root.get(TicketWaitRelease_.timeAppliedEdit), releasedTime));
                }
            }
            // vehicle
            if (vehicle != null) {
                predicates.add(cb.equal(root.get(TicketWaitRelease_.vehicle), vehicle));
            }
            // ids IN
            if (ids != null) {
                predicates.add(root.get(TicketWaitRelease_.ticketId).in(ids));
            }
            // price
            if (price != null) {
                String field = SpecificationUtils.getFieldPriceString(priceCategory);
                if ("UP".equalsIgnoreCase(trendPrice)) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get(field), price));
                } else if ("DOWN".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.lessThanOrEqualTo(root.get(field), price));
                } else {
                    predicates.add(cb.equal(root.get(field), price));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
