package com.example.parking_service.Specification.impl;

import com.example.parking_service.Specification.TicketSpecification;
import com.example.parking_service.entity.Ticket;
import com.example.parking_service.entity.Ticket_;
import com.example.parking_service.enums.TicketStatus;
import com.example.parking_service.utils.SpecificationUtils;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class TicketSpecificationImpl implements TicketSpecification {
    @Override
    public Specification<Ticket> partnerSearch(
            String ticketName,
            Integer status,
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
            predicates.add(cb.equal(root.get(Ticket_.partnerId), partnerId));
            // ticketName LIKE
            if (ticketName != null) {
                predicates.add(cb.like(root.get(Ticket_.name), "%" + ticketName + "%", '!'));
            }
            // modifyStatus
            if (modifyStatus != null) {
                predicates.add(cb.equal(root.get(Ticket_.modifyStatus), modifyStatus));
            }
            // releasedTime
            if (releasedTime != null) {
                if ("UP".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get(Ticket_.releasedTime), releasedTime));
                } else if ("DOWN".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.lessThanOrEqualTo(root.get(Ticket_.releasedTime), releasedTime));
                } else {
                    predicates.add(cb.equal(root.get(Ticket_.releasedTime), releasedTime));
                }
            }
            // vehicle
            if (vehicle != null) {
                predicates.add(cb.equal(root.get(Ticket_.vehicle), vehicle));
            }
            // ids IN
            if (ids != null) {
                predicates.add(root.get(Ticket_.ticketId).in(ids));
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
    public Specification<Ticket> adminSearch(
            String ticketName,
            Integer status,
            Integer modifyStatus,
            LocalDateTime releasedTime,
            String trendReleasedTime,
            Integer vehicle,
            List<Long> ids,
            List<String> partnerIds,
            Long price,
            String trendPrice,
            Integer priceCategory
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            //status
            predicates.add(cb.equal(root.get(Ticket_.status), status));
            // partnerIds IN
            if (partnerIds != null) {
                predicates.add(root.get(Ticket_.partnerId).in(partnerIds));
            }
            // ticketName LIKE
            if (ticketName != null) {
                predicates.add(cb.like(root.get(Ticket_.name), "%" + ticketName + "%", '!'));
            }
            // modifyStatus
            if (modifyStatus != null) {
                predicates.add(cb.equal(root.get(Ticket_.modifyStatus), modifyStatus));
            }
            // releasedTime
            if (releasedTime != null) {
                if ("UP".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get(Ticket_.releasedTime), releasedTime));
                } else if ("DOWN".equalsIgnoreCase(trendReleasedTime)) {
                    predicates.add(cb.lessThanOrEqualTo(root.get(Ticket_.releasedTime), releasedTime));
                } else {
                    predicates.add(cb.equal(root.get(Ticket_.releasedTime), releasedTime));
                }
            }
            // vehicle
            if (vehicle != null) {
                predicates.add(cb.equal(root.get(Ticket_.vehicle), vehicle));
            }
            // ids IN
            if (ids != null) {
                predicates.add(root.get(Ticket_.ticketId).in(ids));
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
    public Specification<Ticket> search(Integer vehicle, Integer priceCategory, List<Long> ticketIds) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            // phương tiện
            if (vehicle != null) {
                predicates.add(cb.equal(root.get(Ticket_.VEHICLE), vehicle));
            }
            // phân loại giá
            if (priceCategory != null) {
                String field = SpecificationUtils.getFieldPriceString(priceCategory);
                predicates.add(cb.isNotNull(root.get(field)));
            }
            // tìm kiếm trong listId
            SpecificationUtils.findIn(cb, root, predicates, Ticket_.TICKET_ID, ticketIds);
            // trạng thái
            SpecificationUtils.findIn(cb, root, predicates, Ticket_.STATUS, List.of(TicketStatus.DANG_PHAT_HANH, TicketStatus.CHO_PHAT_HANH));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
