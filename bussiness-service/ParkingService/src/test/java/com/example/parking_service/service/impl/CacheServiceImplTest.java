package com.example.parking_service.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CacheServiceImplTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private CacheServiceImpl cacheService;

    @BeforeEach
    void setup() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    // ========== Test case 1 ==========
    @Test
    void putWithTTL_success() {
        String key = "test:key";
        String value = "hello";
        long ttl = 10;

        cacheService.putWithTTL(key, value, ttl, TimeUnit.MINUTES);

        verify(valueOperations)
                .set(key, value, ttl, TimeUnit.MINUTES);
    }

    // ========== Test case 2 ==========
    @Test
    void get_success_and_convertValue() {
        String key = "test:key";
        Object rawValue = new Object();
        String expected = "result";

        when(valueOperations.get(key)).thenReturn(rawValue);
        when(objectMapper.convertValue(rawValue, String.class))
                .thenReturn(expected);

        String result = cacheService.get(key, String.class);

        assertNotNull(result);
        assertEquals(expected, result);
        verify(objectMapper).convertValue(rawValue, String.class);
    }

    // ========== Test case 3 ==========
    @Test
    void get_keyNotExist_returnNull() {
        String key = "not:exist";

        when(valueOperations.get(key)).thenReturn(null);

        String result = cacheService.get(key, String.class);

        assertNull(result);
        verify(objectMapper, never())
                .convertValue(any(Object.class), eq(String.class));
    }
}
