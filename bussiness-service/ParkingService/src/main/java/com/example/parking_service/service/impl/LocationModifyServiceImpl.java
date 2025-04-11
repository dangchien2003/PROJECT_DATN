package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.enums.IsDel;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.request.ApproveRequest;
import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.example.parking_service.entity.Location;
import com.example.parking_service.entity.LocationModify;
import com.example.parking_service.enums.LocationModifyStatus;
import com.example.parking_service.enums.LocationStatus;
import com.example.parking_service.mapper.LocationMapper;
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

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class LocationModifyServiceImpl implements LocationModifyService {
    LocationModifyRepository locationModifyRepository;
    LocationRepository locationRepository;
    LocationModifyMapper locationModifyMapper;
    LocationMapper locationMapper;
    ObjectMapper objectMapper;

    @Override
    public ApiResponse<Object> approve(ApproveRequest request) {
        Long modifyId = Long.parseLong(request.getId());
        LocationModify modifyEntity = locationModifyRepository.findByModifyIdAndIsDel(modifyId, IsDel.DELETE_NOT_YET.getValue())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        // kiểm tra thời hạn
        Duration duration = Duration.between(LocalDateTime.now(), modifyEntity.getTimeAppliedEdit());
        if (duration.toSeconds() < 0) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Yêu cầu đã vượt quá thời được duyệt"));
        }
        if (Boolean.TRUE.equals(request.getApprove())) {
            // xử lý khi duyệt
            if (modifyEntity.getLocationId() != null) {
                Location locationEntity = locationRepository.findById(modifyEntity.getLocationId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
                processWhenApproveIsModify(locationEntity, modifyEntity);
            } else {
                processWhenApproveIsCreate(modifyEntity);
            }
            // update modify
            modifyEntity.setModifyStatus(LocationModifyStatus.DA_DUYET_CHO_AP_DUNG.getValue());
        } else {
            // xử lý khi từ chối duyệt
            if (modifyEntity.getLocationId() != null) {
                Location locationEntity = locationRepository.findById(modifyEntity.getLocationId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
                locationEntity.setModifyStatus(LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue());
            }
            // update chung
            modifyEntity.setModifyStatus(LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue());
            modifyEntity.setReason(request.getReason());
        }
        DataUtils.setDataAction(modifyEntity, ParkingServiceApplication.testAdminUUID, false);
        locationModifyRepository.save(modifyEntity);
        return ApiResponse.builder().build();
    }

    void processWhenApproveIsCreate(LocationModify modify) {
        // convert
        Location location = locationMapper.toLocationFromModify(modify);
        // thêm mới bản ghi
        location.setApproveBy(ParkingServiceApplication.testAdminUUID);
        location.setStatus(LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue());
        location.setModifyStatus(LocationModifyStatus.DA_DUYET_CHO_AP_DUNG.getValue());
        DataUtils.setDataAction(location, ParkingServiceApplication.testAdminUUID, true);
        // lưu
        locationRepository.save(location);
    }

    void processWhenApproveIsModify(Location location, LocationModify modify) {
        // convert
        locationMapper.toLocationFromModify(location, modify);
        // sửa bản ghi
        location.setApproveBy(ParkingServiceApplication.testAdminUUID);
        location.setModifyStatus(LocationModifyStatus.DA_DUYET_CHO_AP_DUNG.getValue());
        DataUtils.setDataAction(location, ParkingServiceApplication.testAdminUUID, false);
        locationRepository.save(location);
    }

    @Override
    public ApiResponse<Object> modifyLocation(ModifyLocationRequest request, String actionBy) throws JsonProcessingException {
        // kiểm tra sự tôn tại bản ghi chính khi chỉnh sửa
        Location location = null;
        if (!DataUtils.isNullOrEmpty(request.getLocationId())) {
            location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        }
        // check trùng tên làm sau
        // kiểm trùng tên địa điểm
//        Optional<Location> resultCheck = locationModifyRepository.checkDuplicateName(request.getName(), LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue());
//        if (resultCheck.isPresent()) {
//            throw new AppException(
//                    ErrorCode.DATA_EXISTED.withMessage("Địa điểm " + request.getName().toLowerCase(Locale.ROOT) + " đã tồn tại"));
//        }
        // map qua entity
        LocationModify entityModify = locationModifyMapper.toLocationModify(request);
        // gắn thêm data
        entityModify.setPartnerId(actionBy);
        entityModify.setModifyStatus(LocationModifyStatus.CHO_DUYET.getValue());
        entityModify.setCoordinates(objectMapper.writeValueAsString(request.getCoordinates()));
        entityModify.setIsDel(IsDel.DELETE_NOT_YET.getValue());
        // action
        if (DataUtils.isNullOrEmpty(location)) {
            // khi tạo mới
            entityModify.setLocationId(null);
            entityModify.setOpenDate(DataUtils.convertToDate(entityModify.getTimeAppliedEdit()));
            entityModify.setStatus(LocationStatus.CHO_DUYET.getValue());
            entityModify.setModifyCount(0);
            DataUtils.setDataAction(entityModify, actionBy, true);
        } else {
            validateActionRecordByOwner(location.getPartnerId(), actionBy);
            // lỗi khi địa điểm đang chờ duyệt
            if (!location.getModifyStatus().equals(LocationModifyStatus.CHO_DUYET.getValue())) {
                throw new AppException(ErrorCode.DATA_EXISTED.withMessage("Địa điểm đang tồn tại bản ghi chờ duyệt"));
            }
            // thay đổi data khi chỉnh sửa
            // location
            location.setModifyStatus(LocationModifyStatus.CHO_DUYET.getValue());
            DataUtils.setDataAction(location, actionBy, false);
            // modify
            Integer modifyCount = locationModifyRepository.getMaxModifyCountByLocationId(location.getLocationId()) + 1;
            entityModify.setModifyCount(modifyCount);
            DataUtils.setDataAction(entityModify, actionBy, true);
        }
        // save
        entityModify = locationModifyRepository.save(entityModify);
        return ApiResponse.builder()
                .result(entityModify.getModifyId())
                .build();
    }

    @Override
    public ApiResponse<Object> deleteModify(Long modifyId) {
        LocationModify modify = locationModifyRepository.findById(modifyId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        validateActionRecordByOwner(modify.getPartnerId(), ParkingServiceApplication.testPartnerActionBy);
        // lỗi khi bản ghi đã xoá trước đó
        if (modify.getIsDel().equals(IsDel.DELETED.getValue())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Bản ghi đã được xoá trước đó"));
        }
        // lỗi khi bản ghi không trong trạng thái chờ duyệt
        if (!modify.getModifyStatus().equals(LocationModifyStatus.CHO_DUYET.getValue())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không thể xoá bản ghi không phải chờ duyệt"));
        }
        //set dữ liệu
        modify.setIsDel(IsDel.DELETED.getValue());
        DataUtils.setDataAction(modify, ParkingServiceApplication.testPartnerActionBy, false);
        locationModifyRepository.save(modify);
        return ApiResponse.builder().build();
    }

    void validateActionRecordByOwner(String owner, String actionBy) {
        // lỗi khi sửa địa điểm đối tác không sở hữu
        if (!owner.equals(actionBy)) {
            throw new AppException(ErrorCode.NO_ACCESS);
        }
    }
}
