package com.example.common;

import com.example.common.utils.RandomUtils;
import org.springframework.boot.SpringApplication;

public class CommonApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommonApplication.class, args);
        System.out.println(RandomUtils.generateRandomCharacter(10));
        System.out.println(RandomUtils.generateRandomCharacter());
    }

}
