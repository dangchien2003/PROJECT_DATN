package com.example.common.exception;

import com.example.common.dto.response.ApiResponse;
import com.example.common.utils.ENumUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<Object>> handlingException(Exception e) {
        log.error("error: ", e);
        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;
        return setResponse(errorCode);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Object>> handlingAppException(AppException e) {
        log.error("error: ", e);
        ErrorCode errorCode = e.getErrorCode();
        return setResponse(errorCode);
    }


    @ExceptionHandler(value = HttpMessageNotReadableException.class)
    ResponseEntity<ApiResponse<Object>> handlingHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.error("error: ", e);
        ErrorCode errorCode = ErrorCode.BODY_PARSE_FAIL;
        return setResponse(errorCode);
    }

//    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
//    ResponseEntity<ApiResponse<Object>> handlingHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
//        ErrorCode errorCode = ErrorCode.NOTFOUND_ENDPOINT;
//        return setResponse(errorCode);
//    }

    @ExceptionHandler(value = MethodArgumentTypeMismatchException.class)
    ResponseEntity<ApiResponse<Object>> handlingMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        log.error("error: ", e);
        ErrorCode errorCode = ErrorCode.INVALID_DATA;
        return setResponse(errorCode);
    }

//    @ExceptionHandler(value = HandlerMethodValidationException.class)
//    ResponseEntity<ApiResponse<Object>> handlingHandlerMethodValidationException(HandlerMethodValidationException e) {
//        try {
//            ParameterValidationResult parameterValidationResult =
//                    e.getAllValidationResults().get(0); // get first ParameterValidationResult
//
//            String message = parameterValidationResult
//                    .getResolvableErrors().get(0)
//                    .getDefaultMessage(); // get first message
//
//            ErrorCode errorCode = ENumUtils.getType(ErrorCode.class, message);
//            return setResponse(errorCode);
//        } catch (AppException appException) {
//            return setResponse(ErrorCode.INVALID_DATA);
//        }
//    }


//    @ExceptionHandler(value = NoResourceFoundException.class)
//    ResponseEntity<ApiResponse<Object>> handlingNoResourceFoundException(NoResourceFoundException e) {
//        ErrorCode errorCode = ErrorCode.NOTFOUND_ENDPOINT;
//        return setResponse(errorCode);
//    }

    //
//    @ExceptionHandler(value = AuthorizationDeniedException.class)
//    ResponseEntity<ApiResponse<Object>> handlingAuthorizationDeniedException(AuthorizationDeniedException e) {
//        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;
//        return setResponse(errorCode);
//    }
//
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Object>> handlingMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("error: ", e);
        String firstErrorMessage = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .orElse(ErrorCode.INVALID_DATA.getMessage());

        try {
            ErrorCode errorCode = ENumUtils.getType(ErrorCode.class, firstErrorMessage);
            return setResponse(errorCode);
        } catch (AppException appException) {
            return ResponseEntity.
                    status(ErrorCode.INVALID_DATA.getHttpStatusCode())
                    .body(ApiResponse.builder()
                            .code(ErrorCode.INVALID_DATA.getCode())
                            .message(firstErrorMessage)
                            .build());
        }
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
