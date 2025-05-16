package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.enums.IsDel;
import com.example.common.enums.Release;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.common.utils.TimeUtil;
import com.example.parking_service.ParkingServiceApplication;
import com.example.parking_service.dto.other.ScheduledJob;
import com.example.parking_service.dto.other.ScheduledJobId;
import com.example.parking_service.dto.request.ApproveRequest;
import com.example.parking_service.dto.request.ModifyLocationRequest;
import com.example.parking_service.entity.Location;
import com.example.parking_service.entity.LocationModify;
import com.example.parking_service.entity.LocationWaitRelease;
import com.example.parking_service.enums.LocationModifyStatus;
import com.example.parking_service.enums.LocationStatus;
import com.example.parking_service.enums.ModuleName;
import com.example.parking_service.mapper.LocationMapper;
import com.example.parking_service.mapper.LocationModifyMapper;
import com.example.parking_service.mapper.LocationWaitReleaseMapper;
import com.example.parking_service.repository.LocationModifyRepository;
import com.example.parking_service.repository.LocationRepository;
import com.example.parking_service.repository.LocationWaitReleaseRepository;
import com.example.parking_service.service.LocationModifyService;
import com.example.parking_service.service.SchedulerService;
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
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class LocationModifyServiceImpl implements LocationModifyService {
    LocationModifyRepository locationModifyRepository;
    LocationRepository locationRepository;
    LocationWaitReleaseRepository locationWaitReleaseRepository;
    SchedulerService schedulerService;
    LocationModifyMapper locationModifyMapper;
    LocationMapper locationMapper;
    LocationWaitReleaseMapper locationWaitReleaseMapper;
    ObjectMapper objectMapper;

    @Override
    public ApiResponse<Object> detailModify(Long id) {
        boolean roleAdmin = false;
        String accountId = ParkingServiceApplication.testPartnerActionBy;
        LocationModify locationModify = locationModifyRepository.findByModifyIdAndIsDel(id, IsDel.DELETE_NOT_YET.getValue())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!roleAdmin && !locationModify.getPartnerId().equals(accountId)) {
            throw new AppException(ErrorCode.NO_ACCESS);
        }
        return ApiResponse.builder()
                .result(locationModifyMapper.toLocationModifyResponse(locationModify))
                .build();
    }

    @Override
    public ApiResponse<Object> approve(ApproveRequest request) {
        Long modifyId = Long.parseLong(request.getId());
        LocationModify modifyEntity = locationModifyRepository.findByModifyIdAndIsDel(modifyId, IsDel.DELETE_NOT_YET.getValue())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        // kiểm tra trạng thái
        if (!modifyEntity.getModifyStatus().equals(LocationModifyStatus.CHO_DUYET.getValue())) {
            throw new AppException(ErrorCode.CONFLICT_DATA.withMessage("Không thể thực thi hành động"));
        }
        // kiểm tra thời hạn
        Duration duration = Duration.between(LocalDateTime.now(), modifyEntity.getTimeAppliedEdit());
        if (duration.toSeconds() < 0 && Boolean.TRUE.equals(request.getApprove())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Yêu cầu đã vượt quá thời điểm được duyệt"));
        }
        if (Boolean.TRUE.equals(request.getApprove())) {
            // xử lý khi duyệt
            // update modify
            modifyEntity.setModifyStatus(LocationModifyStatus.DA_DUYET_CHO_AP_DUNG.getValue());
            // cập nhật và thêm bản ghi chờ áp dụng
            List<LocationWaitRelease> locationWaitReleases = locationWaitReleaseRepository.findRecord(
                    modifyEntity.getLocationId(),
                    modifyEntity.getModifyId(),
                    IsDel.DELETE_NOT_YET.getValue(),
                    Release.RELEASE_NOT_YET.getValue()
            );
            if (!locationWaitReleases.isEmpty()) {
                // xoá các bản ghi tồn tại
                locationWaitReleases.forEach(item -> {
                    item.setIsDel(IsDel.DELETED.getValue());
                    DataUtils.setDataAction(item, ParkingServiceApplication.testAdminUUID, false);
                });
            }
            // tạo bản ghi
            LocationWaitRelease entity = locationWaitReleaseMapper.toLocationWaitRelease(modifyEntity);
            entity.setApproveBy(ParkingServiceApplication.testAdminUUID);
            entity.setStatus(LocationStatus.DA_DUYET_DANG_HOAT_DONG.getValue());
            entity.setModifyStatus(LocationModifyStatus.DA_DUYET_CHO_AP_DUNG.getValue());
            entity.setReleased(Release.RELEASE_NOT_YET.getValue());
            DataUtils.setDataAction(entity, ParkingServiceApplication.testAdminUUID, true);
            locationWaitReleases.add(entity);
            // lưu
            locationWaitReleaseRepository.saveAll(locationWaitReleases);
            insertScheduler(entity);
        } else {
            // xử lý khi từ chối duyệt
            if (modifyEntity.getLocationId() != null) {
                Location locationEntity = locationRepository.findById(modifyEntity.getLocationId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
                locationEntity.setModifyStatus(LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue());
            }
            // update chung khi từ chối
            modifyEntity.setModifyStatus(LocationModifyStatus.TU_CHOI_PHE_DUYET.getValue());
            modifyEntity.setReasonReject(request.getReason());
        }
        DataUtils.setDataAction(modifyEntity, ParkingServiceApplication.testAdminUUID, false);
        locationModifyRepository.save(modifyEntity);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> modifyLocation(ModifyLocationRequest request, String actionBy) throws JsonProcessingException {
        // kiểm tra sự tôn tại bản ghi chính khi chỉnh sửa
        Location location = null;
        if (!DataUtils.isNullOrEmpty(request.getLocationId())) {
            location = locationRepository.findByLocationIdAndPartnerId(request.getLocationId(), actionBy)
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
        if (!DataUtils.isNullOrEmpty(request.getCoordinates().getX())
                && !DataUtils.isNullOrEmpty(request.getCoordinates().getY())) {
            entityModify.setCoordinates(objectMapper.writeValueAsString(request.getCoordinates()));
        }
        entityModify.setIsDel(IsDel.DELETE_NOT_YET.getValue());
        // action
        if (DataUtils.isNullOrEmpty(location) && !DataUtils.isNullOrEmpty(request.getLocationId())) {
            // lỗi nếu chỉnh sửa bản ghi không tồn tại
            throw new AppException(ErrorCode.NOT_FOUND);
        } else if (DataUtils.isNullOrEmpty(location)) {
            // khi tạo mới
            entityModify.setLocationId(null);
            entityModify.setOpenDate(entityModify.getTimeAppliedEdit());
            entityModify.setStatus(LocationStatus.CHO_DUYET.getValue());
            entityModify.setModifyCount(0);
            entityModify.setCapacity(11L);
            DataUtils.setDataAction(entityModify, actionBy, true);
        } else {
            validateActionRecordByOwner(location.getPartnerId(), actionBy);
            // lỗi khi địa điểm đang chờ duyệt
            if (location.getModifyStatus().equals(LocationModifyStatus.CHO_DUYET.getValue())) {
                throw new AppException(ErrorCode.DATA_EXISTED.withMessage("Địa điểm đang tồn tại bản ghi chờ duyệt"));
            }
            // thay đổi data khi chỉnh sửa
            // location
            location.setModifyStatus(LocationModifyStatus.CHO_DUYET.getValue());
            DataUtils.setDataAction(location, actionBy, false);
            // modify
            Integer modifyCount = locationModifyRepository.getMaxModifyCountByLocationId(location.getLocationId());
            if (modifyCount == null) {
                modifyCount = 1;
            } else {
                modifyCount += 1;
            }
            entityModify.setCapacity(11L);
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

    private void insertScheduler(LocationWaitRelease locationWaitRelease) {
        String actionBy = "scheduler";
        if (locationWaitRelease.getTimeAppliedEdit().isAfter(TimeUtil.getStartOfNextHour())) {
            return;
        }
        // lệnh sẽ chạy khi tới thời điểm
        Runnable runnable = () -> {
            try {
                executeApplyLocation(locationWaitRelease, actionBy);
            } catch (Exception e) {
                log.error("Error: ", e);
            }
        };
        ScheduledJob scheduledJob = ScheduledJob.builder()
                .scheduledJobId(new ScheduledJobId(ModuleName.LOCATION, locationWaitRelease.getId().toString()))
                .task(runnable)
                .runAt(locationWaitRelease.getTimeAppliedEdit())
                .build();
        schedulerService.addTask(scheduledJob);
    }

    public void executeApplyLocation(LocationWaitRelease locationWaitRelease, String actionBy) throws JsonProcessingException {
        String beforeUpdate = objectMapper.writeValueAsString(locationWaitRelease);
        // thay đổi entity release
        locationWaitRelease.setReleased(Release.RELEASE.getValue());
        locationWaitRelease.setReleaseAt(LocalDateTime.now());
        DataUtils.setDataAction(locationWaitRelease, actionBy, false);
        // lưu
        locationWaitReleaseRepository.save(locationWaitRelease);

        try {
            // thay thế bản ghi phát hành
            Location location;
            if (!DataUtils.isNullOrEmpty(locationWaitRelease.getLocationId())) {
                location = locationRepository.findById(locationWaitRelease.getLocationId())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("Không tìm thấy địa điểm có id: " + locationWaitRelease.getLocationId())));
            } else {
                location = new Location();
            }
            // map dữ liệu
            locationMapper.toLocationFromReleaseEntity(location, locationWaitRelease);
            location.setModifyStatus(LocationModifyStatus.DA_AP_DUNG.getValue());
            // thay đổi thời gian tác động
            DataUtils.setDataAction(location, actionBy, DataUtils.isNullOrEmpty(locationWaitRelease.getLocationId()));
            // lưu dữ liệu
            locationRepository.save(location);
        } catch (Exception e) {
            log.error("error: ", e);
            // rollback nếu lỗi
            try {
                LocationWaitRelease locationWaitReleaseRollback = objectMapper.readValue(beforeUpdate, LocationWaitRelease.class);
                locationWaitReleaseRepository.save(locationWaitReleaseRollback);
            } catch (JsonProcessingException ex) {
                log.error("error: ", ex);
                log.error("lỗi rollback dữ liệu(LocationWaitRelease): " + beforeUpdate);
            }
        }
    }

    @Override
    public void loadScheduler() {
        LocalDateTime from = TimeUtil.getStartOfCurrentHour();
        LocalDateTime to = TimeUtil.getStartOfNextHour();
        List<LocationWaitRelease> entityList = locationWaitReleaseRepository
                .findAllRecordWaitReleaseThisHour(from, to, IsDel.DELETE_NOT_YET.getValue(), Release.RELEASE_NOT_YET.getValue());
        for (LocationWaitRelease locationWaitRelease : entityList) {
            insertScheduler(locationWaitRelease);
        }
    }
}
