package com.example.parking_service.exception;

import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandlerParking {
    @ExceptionHandler(value = MissingServletRequestParameterException.class)
    ResponseEntity<ApiResponse<Object>> handlingMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        log.error("error: ", e);
        ErrorCode errorCode = ErrorCode.INVALID_DATA;
        return setResponse(errorCode);
    }

    ResponseEntity<ApiResponse<Object>> setResponse(ErrorCode errorCode) {
        ApiResponse<Object> apiResponse = ApiResponse.builder()
                .message(errorCode.getMessage())
                .code(errorCode.getCode())
                .build();
        return ResponseEntity.
                status(errorCode.getHttpStatusCode())
                .body(apiResponse);
    }
}
