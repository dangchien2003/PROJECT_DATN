package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.example.parking_service.entity.LocationModify;
import com.example.parking_service.enums.LocationModifyStatus;
import com.example.parking_service.enums.LocationStatus;
import com.example.parking_service.mapper.LocationModifyMapper;
import com.example.parking_service.repository.LocationModifyRepository;
import com.example.parking_service.repository.LocationRepository;
import com.example.parking_service.service.LocationModifyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class LocationModifyServiceImpl implements LocationModifyService {
    LocationModifyRepository locationModifyRepository;
    LocationRepository locationRepository;
    LocationModifyMapper locationModifyMapper;
    ObjectMapper objectMapper;

    @Override
    public ApiResponse<Object> modifyLocation(ModifyLocationRequest request, String actionBy) throws JsonProcessingException {
        // kiểm tra sự tôn tại bản ghi chính khi chỉnh sửa
        if (!DataUtils.isNullOrEmpty(request.getLocationId()) && !locationRepository.existsById(request.getLocationId())) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        // check trùng tên làm sau
        // kiểm trùng tên địa điểm
//        Optional<Location> resultCheck = locationModifyRepository.checkDuplicateName(request.getName(), LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue());
//        if (resultCheck.isPresent()) {
//            throw new AppException(
//                    ErrorCode.DATA_EXISTED.withMessage("Địa điểm " + request.getName().toLowerCase(Locale.ROOT) + " đã tồn tại"));
//        }
        // map qua entity
        LocationModify entity = locationModifyMapper.toLocationModify(request);
        // gắn thêm data
        entity.setModifyStatus(LocationModifyStatus.CHO_DUYET.getValue());
        entity.setCoordinates(objectMapper.writeValueAsString(request.getCoordinates()));
        // action
        if (DataUtils.isNullOrEmpty(request.getLocationId())) {
            // khi tạo mới
            entity.setLocationId(null);
            entity.setPartnerId(actionBy);
            entity.setOpenDate(DataUtils.convertToDate(entity.getTimeAppliedEdit()));
            entity.setStatus(LocationStatus.CHO_DUYET.getValue());
            entity.setModifyCount(0);
            DataUtils.setDataAction(entity, actionBy, true);
        } else {
            // khi chỉnh sửa
            DataUtils.setDataAction(entity, actionBy, false);
        }
        // save
        entity = locationModifyRepository.save(entity);
        return ApiResponse.builder()
                .result(entity.getModifyId())
                .build();
    }
}
