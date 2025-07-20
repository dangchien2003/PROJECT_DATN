package com.example.common.utils;

import jakarta.validation.constraints.NotNull;

public class RegexUtils {
    public static final String REGEX_PHONE_NUMBER_VI = "^(0|\\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$";
    public static final String REGEX_EMAIL = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
    // phải có ít nhất 1 ký tự hoa 1 thường 1 số 1 đặc bit
    public static final String REGEX_PASSWORD = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$";
    public static final String USER_AGENT_REGEX =
            ".*(Mozilla|Chrome|Safari|Firefox|Opera|Edge|Trident).*(Windows|Macintosh|Linux|Android|iPhone).*";

    public static boolean checkData(@NotNull String value, @NotNull String regex) {
        return value.matches(regex);
    }

}
