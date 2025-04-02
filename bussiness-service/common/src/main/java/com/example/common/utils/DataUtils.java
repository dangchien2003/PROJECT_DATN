package com.example.common.utils;

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
            if (isCreate) {
                Method setCreatedAt = data.getClass().getMethod("setCreatedAt", LocalDateTime.class);
                Method setCreatedBy = data.getClass().getMethod("setCreatedBy", String.class);
                setCreatedAt.invoke(data, now);
                setCreatedBy.invoke(data, actionBy);
            } else {
                Method setModifiedAt = data.getClass().getMethod("setModifiedAt", LocalDateTime.class);
                Method setModifiedBy = data.getClass().getMethod("setModifiedBy", String.class);
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
}
