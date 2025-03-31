package com.example.common.utils;

import jakarta.validation.constraints.NotNull;

public class RegexUtils {
    public static final String REGEX_PHONE_NUMBER_VI = "^(0|\\\\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$\n";
    public static final String REGEX_EMAIL = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    public static final String REGEX_PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$";

    public static boolean checkData(@NotNull String value, @NotNull String regex) {
        return value.matches(regex);
    }

}
