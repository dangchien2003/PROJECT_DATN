package com.example.parking_service.enums;

import org.springframework.stereotype.Component;

@Component
public class UrlReturn {

    public static String getDepositUrl(String domainFe) {
        return domainFe + "/deposit";
    }

    public static String getListTicketUrl(String domainFe) {
        return domainFe + "/list/ticket";
    }

    public static String getDetailTicketUrl(String domainFe, String ticketId) {
        return domainFe + "/ticket/detail/" + ticketId;
    }
}

