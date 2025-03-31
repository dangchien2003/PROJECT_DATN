package com.example.common.utils;


import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.util.Locale;

@Slf4j
public class ENumUtils {
    private ENumUtils() {
    }

    public static <T extends Enum<T>> T getType(Class<T> classType, String name) {
        name = name.toUpperCase(Locale.ROOT);

        try {
            return Enum.valueOf(classType, name);
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }
    }

    public static boolean isValidEnumByField(Class<? extends Enum<?>> enumClass, Object valueToCheck, String fieldName) {
        for (Enum<?> enumConstant : enumClass.getEnumConstants()) {
            try {
                Field field = enumConstant.getClass().getDeclaredField(fieldName);
                field.setAccessible(true); // cho phép truy cập private field
                Object fieldValue = field.get(enumConstant);

                if (fieldValue != null && fieldValue.equals(valueToCheck)) {
                    return true;
                }
            } catch (NoSuchFieldException | IllegalAccessException e) {
                log.error("error: ", e);
                return false;
            }
        }
        return false;
    }
}
