package com.example.parking_service.service.impl;

import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.parking_service.service.CryptoService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class AesCryptoServiceImpl implements CryptoService {

    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final int IV_LENGTH = 16;

    String secretKey;

    public AesCryptoServiceImpl(@Value("${crypto.AES.AES-SECRET_KEY}") String secretKey) {
        this.secretKey = secretKey;
    }

    @Override
    public String encrypt(String plainText) {
        try {
            // Sinh IV ngẫu nhiên
            byte[] ivBytes = randomIV();
            IvParameterSpec iv = new IvParameterSpec(ivBytes);

            // Tạo key
            SecretKeySpec skeySpec = new SecretKeySpec(secretKey.getBytes("UTF-8"), "AES");

            // Mã hóa
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes("UTF-8"));

            // Gộp IV + ciphertext
            ByteBuffer byteBuffer = ByteBuffer.allocate(IV_LENGTH + encryptedBytes.length);
            byteBuffer.put(ivBytes);
            byteBuffer.put(encryptedBytes);
            byte[] ivAndEncrypted = byteBuffer.array();

            // Trả về chuỗi Base64
            return Base64.getEncoder().encodeToString(ivAndEncrypted);

        } catch (Exception ex) {
            log.error("AES encryption failed", ex);
            throw new AppException(ErrorCode.INVALID_DATA);
        }
    }

    @Override
    public String decrypt(String encryptedText) {
        try {
            // Decode Base64
            byte[] ivAndEncrypted = Base64.getDecoder().decode(encryptedText);
            ByteBuffer byteBuffer = ByteBuffer.wrap(ivAndEncrypted);

            // tách IV
            byte[] ivBytes = new byte[IV_LENGTH];
            byteBuffer.get(ivBytes);
            IvParameterSpec iv = new IvParameterSpec(ivBytes);

            // 3. Lấy phần ciphertext còn lại
            byte[] encryptedBytes = new byte[byteBuffer.remaining()];
            byteBuffer.get(encryptedBytes);

            // Giải mã
            SecretKeySpec skeySpec = new SecretKeySpec(secretKey.getBytes("UTF-8"), "AES");
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);
            byte[] originalBytes = cipher.doFinal(encryptedBytes);

            return new String(originalBytes, "UTF-8");
        } catch (Exception ex) {
            log.error("AES decryption failed", ex);
            throw new RuntimeException("Decrypt error");
        }
    }

    private byte[] randomIV() {
        byte[] iv = new byte[IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        return iv;
    }
}
