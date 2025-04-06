package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.dto.response.PageResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.ENumUtils;
import com.example.common.utils.RandomUtils;
import com.example.common.utils.RegexUtils;
import com.example.parking_service.dto.request.CreateAccountRequest;
import com.example.parking_service.dto.request.SearchListAccountRequest;
import com.example.parking_service.dto.response.AccountResponse;
import com.example.parking_service.entity.Account;
import com.example.parking_service.enums.AccountCategory;
import com.example.parking_service.enums.AccountStatus;
import com.example.parking_service.mapper.AccountMapper;
import com.example.parking_service.repository.AccountRepository;
import com.example.parking_service.service.AccountService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class AccountServiceImpl implements AccountService {
    AccountRepository accountRepository;
    AccountMapper accountMapper;

    @Override
    public ApiResponse<Object> detail(String idAccount, Integer category) {
        Optional<Account> entity = Optional.empty();
        // lấy data
        if (!DataUtils.isNullOrEmpty(idAccount) && !DataUtils.isNullOrEmpty(category)) {
            entity = accountRepository.findByIdAndCategory(idAccount, category);
        }
        // not found
        if (entity.isEmpty()) {
            throw new AppException(ErrorCode.NOT_FOUND.withMessage("Tài khoản không xác định"));
        } else {
            Account account = entity.get();
            AccountResponse accountResponse = accountMapper.toAccountResponse(account);
            return ApiResponse.builder()
                    .result(accountResponse)
                    .build();
        }
    }

    @Override
    public ApiResponse<Object> searchListPartner(SearchListAccountRequest request, Pageable pageable) {
        String partnerFullName = DataUtils.convertStringSearchLike(request.getPartnerFullName());
        String partnerEmail = DataUtils.convertStringSearchLike(request.getPartnerEmail());
        String partnerPhoneNumber = DataUtils.convertStringSearchLike(request.getPartnerPhoneNumber());

        // lấy dữ liệu db
        Page<Account> result = accountRepository.searchListPartner(
                AccountCategory.DOI_TAC.getValue(),
                partnerFullName,
                partnerEmail,
                partnerPhoneNumber,
                request.getStatus(),
                pageable
        );
        return ApiResponse.builder()
                .result(new PageResponse<>(accountMapper.toListAccountResponses(result.getContent()), result.getTotalPages(), result.getTotalElements()))
                .build();
    }

    @Override
    public ApiResponse<Object> searchListCustomer(SearchListAccountRequest request, Pageable pageable) {
        String fullName = DataUtils.convertStringSearchLike(request.getFullName());
        String email = DataUtils.convertStringSearchLike(request.getEmail());
        String phoneNumber = DataUtils.convertStringSearchLike(request.getPhoneNumber());
        // số dư
        Long balance = null;
        String balanceTrend = null;
        if (!DataUtils.isNullOrEmpty(request.getBalance())) {
            // dữ liệu số dư
            if (!DataUtils.isNullOrEmpty(request.getBalance().getValue())) {
                balance = Long.parseLong(request.getBalance().getValue().toString());
            }
            // cách tìm kiếm kết quả
            if (!DataUtils.isNullOrEmpty(request.getBalance().getTrend())) {
                balanceTrend = request.getBalance().getTrend().toUpperCase(Locale.ROOT);
            }
        }
        // lấy dữ liệu db
        Page<Account> result = accountRepository.searchListCustomer(
                AccountCategory.KHACH_HANG.getValue(),
                fullName,
                email,
                phoneNumber,
                request.getGender(),
                request.getStatus(),
                balance,
                balanceTrend,
                pageable
        );
        return ApiResponse.builder()
                .result(new PageResponse<>(accountMapper.toListAccountResponses(result.getContent()), result.getTotalPages(), result.getTotalElements()))
                .build();
    }

    @Override
    @Transactional
    public ApiResponse<Object> createAccount(CreateAccountRequest request, String idAdmin) {
        boolean isAdmin = !DataUtils.isNullOrEmpty(idAdmin);
        Account accountEntity = commonCreateAccount(request, isAdmin);
        boolean createPartner = false;
        if (isAdmin) {
            accountEntity.setCreatedBy(idAdmin);
            if (request.getCategory().equals(AccountCategory.DOI_TAC.getValue())) {
                // xử lý nếu tạo đối tác
                processPartner(accountEntity);
                createPartner = true;
            }
        }
        if (!createPartner) {
            // xoá dữ liệu thừa
            removePartnerInfo(accountEntity);
        }
        accountRepository.save(accountEntity);
        return ApiResponse.builder()
                .build();
    }

    void removePartnerInfo(Account entity) {
        entity.setPartnerFullName(null);
        entity.setPartnerEmail(null);
        entity.setRepresentativeFullName(null);
        entity.setPartnerPhoneNumber(null);
        entity.setPartnerAddress(null);
    }

    void processPartner(Account entity) {
        // kiểm tra email
        if (!DataUtils.isNullOrEmpty(entity.getPartnerEmail())) {
            if (!RegexUtils.checkData(entity.getPartnerEmail(), RegexUtils.REGEX_EMAIL)) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vui lòng nhập đúng email và thử lại"));
            }
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vui lòng cung cấp email đối tác để tiếp tục"));
        }
        // kiểm tra số điện thoại
        if (!DataUtils.isNullOrEmpty(entity.getPartnerPhoneNumber())) {
            if (!RegexUtils.checkData(entity.getPartnerPhoneNumber(), RegexUtils.REGEX_PHONE_NUMBER_VI)) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Số điện thoại không phù hợp vui lòng nhập và thử lại"));
            }
        }
        // kiểm tra tên đối tác
        if (!DataUtils.isNullOrEmpty(entity.getPartnerFullName())) {
            Optional<Account> nameExist = accountRepository.findByPartnerFullNameIgnoreCase(entity.getPartnerFullName());
            if (nameExist.isPresent()) {
                throw new AppException(ErrorCode.DATA_EXISTED.withMessage("Đối tác \"" + entity.getPartnerFullName() + "\" đã tồn tại, vui lòng thay đổi tên và thử lại"));
            }
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vui lòng cung cấp tên đối tác để tiếp tục"));
        }
    }

    Account commonCreateAccount(CreateAccountRequest request, boolean isAdmin) {
        // kiểm tra sự tồn tại email
        List<Account> resultCheckDuplicate = accountRepository.findAllByEmailOrPhoneNumber(request.getEmail(), request.getPhoneNumber());
        if (!resultCheckDuplicate.isEmpty()) {
            if (resultCheckDuplicate.getFirst().getEmail().equals(request.getEmail())) {
                throw new AppException(ErrorCode.DATA_EXISTED.withMessage("Email đã tồn tại trong hệ thống"));
            } else {
                throw new AppException(ErrorCode.DATA_EXISTED.withMessage("Số điện thoại đã tồn tại trong hệ thống"));
            }
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
        // số dư
        accountEntity.setBalance(0L);
        // mã hoá mật khẩu
        // bổ sung sau
        // khác
        accountEntity.setCreatedAt(LocalDateTime.now());
        return accountEntity;
    }
}
