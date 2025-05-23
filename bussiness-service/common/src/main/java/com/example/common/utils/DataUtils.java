package com.example.common.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collection;
import java.util.Date;

public class DataUtils {
    public static boolean isNullOrEmpty(Object value) {
        if (value == null) return true;
        if (value instanceof Collection<?> collection) {
            return isContainNullOrEmpty(collection);
        }
        return value.toString().isEmpty();
    }

    public static boolean isContainNullOrEmpty(Collection<?> collection) {
        if (collection == null) return true;
        if (collection.isEmpty()) return true;
        for (Object object : collection) {
            if (object == null) return true;
        }
        return false;
    }

    public static <T> void setDataAction(T data, String actionBy, boolean isCreate) {
        LocalDateTime now = LocalDateTime.now();

        try {
            Method setCreatedAt = data.getClass().getMethod("setCreatedAt", LocalDateTime.class);
            Method setCreatedBy = data.getClass().getMethod("setCreatedBy", String.class);
            Method setModifiedAt = data.getClass().getMethod("setModifiedAt", LocalDateTime.class);
            Method setModifiedBy = data.getClass().getMethod("setModifiedBy", String.class);
            if (isCreate) {
                setCreatedAt.invoke(data, now);
                setCreatedBy.invoke(data, actionBy);
                setModifiedAt.invoke(data, (Object) null);
                setModifiedBy.invoke(data, (Object) null);
            } else {
                setModifiedAt.invoke(data, now);
                setModifiedBy.invoke(data, actionBy);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to set audit fields: " + e.getMessage(), e);
        }
    }

    public static Date convertToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static String convertStringSearchLike(String data) {
        if (isNullOrEmpty(data))
            return null;
        return data
                .replace("!", "!!")
                .replace("_", "!_")
                .replace("%", "!%");
    }

    public static Pageable convertPageable(Pageable pageable, String fieldSortDefault) {
        if (pageable.getSort().isUnsorted()) {
            return PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by(Sort.Direction.DESC, fieldSortDefault) // hoặc ASC tùy nhu cầu
            );
        }
        return pageable;
    }
}
