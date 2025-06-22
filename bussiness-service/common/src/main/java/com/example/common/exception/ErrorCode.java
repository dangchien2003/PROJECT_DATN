package com.example.common.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public enum ErrorCode {
    INVALID_DATA(1001, HttpStatus.BAD_REQUEST, "Kiểm tra dữ liệu và thử lại"),
    DATA_EXISTED(1002, HttpStatus.CONFLICT, "Dữ liệu đã tồn tại"),
    CONFLICT_DATA(1002, HttpStatus.CONFLICT, "Không thể thực thi"),
    NOT_FOUND(1003, HttpStatus.NOT_FOUND, "Không tìm thấy dữ liệu bản ghi"),

    INVALID_PAGE_NUMBER(1030, HttpStatus.BAD_REQUEST, "Invalid page number"),

    UNAUTHENTICATED(1041, HttpStatus.UNAUTHORIZED, "Unauthenticated"),
    NO_ACCESS(1042, HttpStatus.FORBIDDEN, "Tài khoản không có quyền truy cập"),
    BODY_PARSE_FAIL(1042, HttpStatus.BAD_REQUEST, "Không thể giải mã dữ liệu"),

    UNCATEGORIZED_EXCEPTION(9999, HttpStatus.INTERNAL_SERVER_ERROR, "Uncategorized error"),
    ;
    int code;
    HttpStatusCode httpStatusCode;
    @NonFinal
    String message;

    public ErrorCode withMessage(String message) {
        this.message = message;
        return this;
    }
}
