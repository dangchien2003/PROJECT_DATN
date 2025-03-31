package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.ENumUtils;
import com.example.common.utils.RandomUtils;
import com.example.common.utils.RegexUtils;
import com.example.parking_service.dto.request.AccountRequest;
import com.example.parking_service.entity.Account;
import com.example.parking_service.enums.AccountCategory;
import com.example.parking_service.enums.AccountStatus;
import com.example.parking_service.mapper.AccountMapper;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.service.AuthenticationService;
import com.example.parking_service.service.PartnerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    AccountRepository accountRepository;
    PartnerService partnerService;
    AccountMapper accountMapper;

    @Override
    @Transactional
    public ApiResponse<Object> createAccount(AccountRequest request, String idAdmin) {
        boolean isAdmin = !DataUtils.isNullOrEmpty(idAdmin);
        Account accountEntity = commonCreateAccount(request, isAdmin);
        if (isAdmin) {
            accountEntity.setCreatedBy(idAdmin);
            if (request.getCategory().equals(AccountCategory.DOI_TAC.getValue())) {
                if (!DataUtils.isNullOrEmpty(request.getPartner())) {
                    // tạo đối tác
                    partnerService.createPartner(request.getPartner(), accountEntity.getId());
                } else {
                    throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không tìm thấy thông tin đối tác vui lòng bổ sung và thử lại"));
                }
            }
        }
        accountRepository.save(accountEntity);

        return ApiResponse.builder()
                .result(accountEntity)
                .build();
    }

    Account commonCreateAccount(AccountRequest request, boolean isAdmin) {
        // kiểm tra sự tồn tại email
        Optional<Account> existEmail = accountRepository.findAllByEmail(request.getEmail());
        if (existEmail.isPresent()) {
            throw new AppException(ErrorCode.DATA_EXISTED.withMessage("Email đã tồn tại trong hệ thống"));
        }

        // kiểm tra và tạo ngẫu nhiên mật khẩu
        if (!isAdmin && DataUtils.isNullOrEmpty(request.getPassword())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vui lòng điền mật khẩu và thử lại"));
        } else if (isAdmin && DataUtils.isNullOrEmpty(request.getPassword())) {
            request.setPassword(RandomUtils.generateRandomCharacter());
        } else if (request.getPassword().length() < 8) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vui lòng nhập mật khẩu lớn hơn hoặc bằng 8 ký tự và thử lại"));
        }
        // kiêm tra mật khẩu hợp lệ
        if (!DataUtils.isNullOrEmpty(request.getPassword()) && !RegexUtils.checkData(request.getPassword(), RegexUtils.REGEX_PASSWORD)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Mật khẩu không hợp lệ, vui lòng thử lại"));
        }

        // kiểm tra tên
        if (DataUtils.isNullOrEmpty(request.getFullName())) {
            request.setFullName(RandomUtils.randomAccountName());
        }

        // kiểm tra số điện thoại
        if (!DataUtils.isNullOrEmpty(request.getPhoneNumber()) && !RegexUtils.checkData(request.getPhoneNumber(), RegexUtils.REGEX_PHONE_NUMBER_VI)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Số điện thoại không phù hợp vui lòng nhập và thử lại"));
        }

        Account accountEntity = accountMapper.toAccount(request);
        // thêm các trường cần thiết
        if (isAdmin) {
            // thay đổi mật khẩu
            accountEntity.setPermitChangePassword(0);
            // trạng thái
            if (ENumUtils.isValidEnumByField(AccountStatus.class, request.getStatus(), "value")) {
                accountEntity.setStatus(request.getStatus());
            } else {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Trạng thái không tồn tại"));
            }
            // phân loại tài khoản
            if (ENumUtils.isValidEnumByField(AccountCategory.class, request.getCategory(), "value")) {
                accountEntity.setCategory(request.getCategory());
            } else {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Tài khoản không thuộc đối tượng nào trong hệ thống"));
            }
        } else {
            accountEntity.setPermitChangePassword(1);
            accountEntity.setStatus(AccountStatus.DANG_HOAT_DONG.getValue());
            accountEntity.setCategory(AccountCategory.KHACH_HANG.getValue());
        }
        //id
        accountEntity.setId(UUID.randomUUID().toString());
        // số dư
        accountEntity.setBalance(0L);
        // mã hoá mật khẩu
        // bổ sung sau
        // khác
        accountEntity.setCreatedAt(LocalDateTime.now());
        return accountEntity;
    }
}
