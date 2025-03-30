package com.example.common.utils;

import java.util.Collection;

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
}
