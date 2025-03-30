package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.RegexUtils;
import com.example.parking_service.dto.request.PartnerRequest;
import com.example.parking_service.entity.Partner;
import com.example.parking_service.mapper.PartnerMapper;
import com.example.parking_service.repository.PartnerRepository;
import com.example.parking_service.service.PartnerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class PartnerServiceImpl implements PartnerService {
    PartnerRepository partnerRepository;
    PartnerMapper partnerMapper;

    @Override
    public ApiResponse<Object> createPartner(PartnerRequest request, String accountId) {
        // kiểm tra email
        if (!DataUtils.isNullOrEmpty(request.getEmail())) {
            if (!RegexUtils.checkData(request.getEmail(), RegexUtils.REGEX_EMAIL)) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vui lòng nhập đúng email và thử lại"));
            }
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vui lòng cung cấp email đối tác để tiếp tục"));
        }
        // kiểm tra số điện thoại
        if (!DataUtils.isNullOrEmpty(request.getPhoneNumber())) {
            if (!RegexUtils.checkData(request.getPhoneNumber(), RegexUtils.REGEX_PHONE_NUMBER_VI)) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Số điện thoại không phù hợp vui lòng nhập và thử lại"));
            }
        }
        // kiểm tra tên đối tác
        if (!DataUtils.isNullOrEmpty(request.getPartnerFullName())) {
            Optional<Partner> nameExist = partnerRepository.findByPartnerFullNameIgnoreCase(request.getPartnerFullName());
            if (nameExist.isPresent()) {
                throw new AppException(ErrorCode.DATA_EXISTED.withMessage("Đối tác \"" + request.getPartnerFullName() + "\" đã tồn tại, vui lòng thay đổi tên và thử lại"));
            }
        }

        Partner partnerEntity = partnerMapper.toPartner(request);
        // thêm dữ liệu
        partnerEntity.setPartnerFullName(request.getPartnerFullName().toUpperCase(Locale.ROOT));
        partnerEntity.setId(UUID.randomUUID().toString());
        partnerEntity.setAccountId(accountId);
        partnerEntity.setCreatedBy("admin");
        partnerEntity.setCreatedAt(LocalDateTime.now());
        //save
        partnerEntity = partnerRepository.save(partnerEntity);
        return ApiResponse.builder()
                .result(partnerEntity)
                .build();
    }
}
