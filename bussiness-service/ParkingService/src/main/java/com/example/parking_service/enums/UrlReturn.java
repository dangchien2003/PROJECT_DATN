package com.example.parking_service.enums;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class UrlReturn {

    private static String domainStatic;
    @Value("${DOMAIN_FE}")
    private String domainFromConfig;

    public static String getDepositUrl() {
        return domainStatic + "/deposit";
    }

    @PostConstruct
    public void init() {
        domainStatic = domainFromConfig;
    }
}

