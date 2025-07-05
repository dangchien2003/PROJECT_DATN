package com.example.parking_service.utils;

import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.parking_service.entity.TicketWaitRelease_;
import com.example.parking_service.enums.PriceCategory;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.Collection;
import java.util.List;

public class SpecificationUtils {
    public static String getFieldPriceString(Integer priceCategory) {
        String field = null;
        if (priceCategory.equals(PriceCategory.TIME)) {
            field = TicketWaitRelease_.PRICE_TIME_SLOT;
        } else if (priceCategory.equals(PriceCategory.DAY)) {
            field = TicketWaitRelease_.PRICE_DAY_SLOT;
        } else if (priceCategory.equals(PriceCategory.WEEK)) {
            field = TicketWaitRelease_.PRICE_WEEK_SLOT;
        } else if (priceCategory.equals(PriceCategory.MONTH)) {
            field = TicketWaitRelease_.PRICE_MONTH_SLOT;
        } else {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
        return field;
    }

    public static <T> void findIn(CriteriaBuilder cb,
                                  Root<?> root,
                                  List<Predicate> predicates,
                                  String fieldName,
                                  Collection<T> values) {
        if (values == null) return;
        Path<T> path = root.get(fieldName);
        CriteriaBuilder.In<T> inClause = cb.in(path);
        for (T value : values) {
            inClause.value(value);
        }
        predicates.add(inClause);
    }
}
