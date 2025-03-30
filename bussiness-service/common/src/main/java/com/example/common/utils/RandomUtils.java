package com.example.common.utils;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class RandomUtils {
    private static final Random RANDOM = new Random();
    private static final SecureRandom RANDOM_PASSWORD = new SecureRandom();

    public static String randomAccountName() {
        final List<String> FIRST_NAMES = List.of(
                "Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Helen",
                "Ivan", "Jack", "Karen", "Leo", "Mia", "Nina", "Oscar", "Paul",
                "Quincy", "Rose", "Steve", "Tom", "Uma", "Violet", "Will", "Xander",
                "Yara", "Zack"
        );

        final List<String> LAST_NAMES = List.of(
                "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia",
                "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
                "Moore", "Martin", "Jackson", "Thompson", "White"
        );

        String firstName = FIRST_NAMES.get(RANDOM.nextInt(FIRST_NAMES.size()));
        String lastName = LAST_NAMES.get(RANDOM.nextInt(LAST_NAMES.size()));
        return firstName + " " + lastName;
    }

    public static String generateRandomCharacter() {
        return generateRandomCharacter(12);
    }

    public static String generateRandomCharacter(int length) {
        final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String LOWER = "abcdefghijklmnopqrstuvwxyz";
        final String DIGITS = "0123456789";
        final String SPECIAL = "!@#$%^&*()";

        List<Character> passwordChars = new ArrayList<>();

        // Bắt buộc có ít nhất 1 ký tự từ mỗi nhóm
        passwordChars.add(UPPER.charAt(RANDOM.nextInt(UPPER.length())));
        passwordChars.add(LOWER.charAt(RANDOM.nextInt(LOWER.length())));
        passwordChars.add(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
        passwordChars.add(SPECIAL.charAt(RANDOM.nextInt(SPECIAL.length())));

        String allChars = UPPER + LOWER + DIGITS + SPECIAL;

        // Random ký ký tự còn lại
        for (int i = 4; i < length; i++) {
            passwordChars.add(allChars.charAt(RANDOM.nextInt(allChars.length())));
        }

        // Trộn ký tự
        Collections.shuffle(passwordChars);

        // Chuyển thành chuỗi
        StringBuilder password = new StringBuilder();
        for (char c : passwordChars) {
            password.append(c);
        }

        return password.toString();
    }
}
