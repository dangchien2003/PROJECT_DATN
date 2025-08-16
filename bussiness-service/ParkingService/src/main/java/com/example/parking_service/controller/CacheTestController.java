package com.example.parking_service.controller;

import com.example.parking_service.service.CacheService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/cache")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CacheTestController {

    CacheService cacheService;

    @PostMapping
    public ResponseEntity<String> saveString(
            @RequestParam String key,
            @RequestParam String value,
            @RequestParam(defaultValue = "60") long ttlSeconds) {

        cacheService.putWithTTL(key, value, ttlSeconds, TimeUnit.SECONDS);
        return ResponseEntity.ok("Value cached with TTL " + ttlSeconds + "s");
    }

    @GetMapping
    public ResponseEntity<String> getString(@RequestParam String key) {
        String value = cacheService.get(key, String.class);
        if (value == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(value);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteString(@RequestParam String key) {
        cacheService.delete(key);
        return ResponseEntity.ok("Key removed from cache");
    }
}
