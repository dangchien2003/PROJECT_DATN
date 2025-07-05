package com.example.parking_service.service;

public interface CryptoService {
    String encrypt(String plainText);

    String decrypt(String encryptedText);
}
