package com.example.parking_service.service.impl;

import com.example.parking_service.service.CacheService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class CacheServiceImpl implements CacheService {
    RedisTemplate<String, Object> redisTemplate;
    ObjectMapper objectMapper;

    public <T> void putWithTTL(String key, T value, long ttl, TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(key, value, ttl, timeUnit);
    }

    public <T> T get(String key, Class<T> clazz) {
        Object raw = redisTemplate.opsForValue().get(key);
        if (raw == null) return null;
        return objectMapper.convertValue(raw, clazz);
    }

    public void delete(String key) {
        redisTemplate.delete(key);
    }
}