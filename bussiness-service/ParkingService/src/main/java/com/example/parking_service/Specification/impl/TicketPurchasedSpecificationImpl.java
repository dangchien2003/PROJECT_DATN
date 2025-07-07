package com.example.parking_service.Specification.impl;

import com.example.common.entity.BaseEntity_;
import com.example.parking_service.Specification.TicketPurchasedSpecification;
import com.example.parking_service.entity.TicketPurchased;
import com.example.parking_service.entity.TicketPurchased_;
import com.example.parking_service.enums.TicketPurchasedStatus;
import com.example.parking_service.enums.TicketPurchasedUseStatus;
import com.example.parking_service.utils.SpecificationUtils;
import jakarta.persistence.criteria.Predicate;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class TicketPurchasedSpecificationImpl implements TicketPurchasedSpecification {
    @Override
    public Specification<TicketPurchased> customerSearch(List<Long> locationIds, LocalDateTime fromBuyDate,
                                                         LocalDateTime toBuyDate, LocalDateTime useDate,
                                                         @NotNull Integer tab, String accountId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (locationIds != null) {
                SpecificationUtils.findIn(cb, root, predicates, TicketPurchased_.LOCATION_ID, locationIds);
            }
            if (fromBuyDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get(BaseEntity_.CREATED_AT), fromBuyDate));
            }
            if (toBuyDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get(BaseEntity_.CREATED_AT), toBuyDate));
            }
            if (useDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get(TicketPurchased_.STARTS_VALIDITY), useDate));
                predicates.add(cb.greaterThanOrEqualTo(root.get(TicketPurchased_.EXPIRES), useDate));
            }
            // chủ vé
            predicates.add(cb.equal(root.get(TicketPurchased_.ACCOUNT_ID), accountId));
            // tab
            if (tab.equals(1)) {
                // đang sử dụng
                predicates.add(cb.equal(root.get(TicketPurchased_.USE_STATUS), TicketPurchasedUseStatus.DANG_SU_DUNG));
            } else if (tab.equals(2)) {
                // không sử dụng
                predicates.add(cb.equal(root.get(TicketPurchased_.USE_STATUS), TicketPurchasedUseStatus.KHONG_SU_DUNG));
                // chưa hết hạn
                predicates.add(cb.greaterThanOrEqualTo(root.get(TicketPurchased_.EXPIRES), LocalDateTime.now()));
            } else if (tab.equals(3)) {
                // vé đã huỷ
                // trạng thái
                Predicate statusPredicate = cb.equal(root.get(TicketPurchased_.STATUS), TicketPurchasedStatus.HUY_VE);
                // hạn sử dụng
                LocalDateTime now = LocalDateTime.now();
                Predicate expirePredicate = cb.lessThanOrEqualTo(root.get(TicketPurchased_.EXPIRES), now);
                Predicate useStatusPredicate = cb.equal(root.get(TicketPurchased_.USE_STATUS), TicketPurchasedUseStatus.KHONG_SU_DUNG);
                Predicate timeCondition = cb.and(expirePredicate, useStatusPredicate);
                // Điều kiện OR: (status = :status OR expire >= :time)
                Predicate orCondition = cb.or(statusPredicate, timeCondition);
                predicates.add(orCondition);
            } else {
                predicates.add(cb.notEqual(root.get(TicketPurchased_.ACCOUNT_ID), root.get(BaseEntity_.CREATED_BY)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
