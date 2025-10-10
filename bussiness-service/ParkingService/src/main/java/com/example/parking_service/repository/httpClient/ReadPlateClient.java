package com.example.parking_service.repository.httpClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "read-plate", url = "http://localhost:5000")
public interface ReadPlateClient {
    @PostMapping(value = "/read-text")
    Map<String, Object> readPlate(@RequestBody Map<String, Object> body);
}
