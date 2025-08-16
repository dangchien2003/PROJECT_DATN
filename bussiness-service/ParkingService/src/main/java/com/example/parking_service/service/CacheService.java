package com.example.parking_service.service;

import java.util.concurrent.TimeUnit;

public interface CacheService {

    <T> void putWithTTL(String key, T value, long ttl, TimeUnit timeUni);

    <T> T get(String key, Class<T> clazz);

    void delete(String cacheKey);
}