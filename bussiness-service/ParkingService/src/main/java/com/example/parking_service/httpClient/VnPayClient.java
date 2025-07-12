package com.example.parking_service.httpClient;

import com.example.parking_service.dto.request.VnPayCheckTransactionRequest;
import com.example.parking_service.dto.response.VnPayCheckTransactionResponse;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "vnPay-server", url = "${vnPay.api-url}")
public interface VnPayClient {
    @PostMapping(consumes = "application/json")
    @Headers("Content-Type: application/json")
    VnPayCheckTransactionResponse checkTransaction(@RequestBody VnPayCheckTransactionRequest request);

}
