package com.example.parking_service.service.impl;

import com.example.common.dto.response.ApiResponse;
import com.example.common.exception.AppException;
import com.example.common.exception.ErrorCode;
import com.example.common.utils.DataUtils;
import com.example.parking_service.dto.other.TicketQr;
import com.example.parking_service.entity.Card;
import com.example.parking_service.entity.TicketInOut;
import com.example.parking_service.entity.TicketPurchased;
import com.example.parking_service.enums.CardStatus;
import com.example.parking_service.enums.CheckingMethod;
import com.example.parking_service.enums.ECloudinary;
import com.example.parking_service.enums.TicketPurchasedStatus;
import com.example.parking_service.repository.*;
import com.example.parking_service.repository.httpClient.ReadPlateClient;
import com.example.parking_service.service.CheckingService;
import com.example.parking_service.service.CryptoService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Transactional
@Slf4j
public class CheckingServiceImpl implements CheckingService {
    CryptoService cryptoService;
    TicketPurchasedRepository ticketPurchasedRepository;
    TicketLocationRepository ticketLocationRepository;
    CardRepository cardRepository;
    TicketInOutRepository ticketInOutRepository;
    ReadPlateClient readPlateClient;
    CloudinaryUploader cloudinaryUploader;
    ObjectMapper objectMapper;

    public static String convertToBase64(MultipartFile file) throws IOException {
        byte[] fileBytes = file.getBytes(); // Đọc toàn bộ dữ liệu file
        return Base64.getEncoder().encodeToString(fileBytes); // Mã hóa sang Base64
    }

    String giaiMaQr(String content) throws JsonProcessingException {
        String contentQr = cryptoService.decrypt(content);
        TicketQr ticketQr = objectMapper.readValue(contentQr, TicketQr.class);
        return ticketQr.getTicketId();
    }

    @Override
    public ApiResponse<Object> checkin(MultipartFile file, Integer method, String content, Long locationId) {
        String ticketPurchasedId;
        String numberCard = null;
        // valid phương thức
        if (method.equals(CheckingMethod.QR)) {
            // giải mã qr
            try {
                ticketPurchasedId = giaiMaQr(content);
            } catch (AppException e) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé của bạn không hợp lệ"));
            } catch (Exception e) {
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION.withMessage("Có lỗi trong quá trình xử lý. Vui lòng thử lại"));
            }
        } else if (method.equals(CheckingMethod.CARD)) {
            Card card = cardRepository.findByNumberCard(content)
                    .orElse(null);
            if (card == null || !card.getStatus().equals(CardStatus.DANG_HOAT_DONG)) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thẻ của bạn không hợp lệ"));
            }
            if (card.getTicketLink() == null) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thẻ của bạn chưa liên kết vé"));
            }
            ticketPurchasedId = card.getTicketLink();
            numberCard = content;
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Phương thức không hỗ trợ"));
        }
        // xử lý thông tin
        TicketPurchased ticketPurchased = ticketPurchasedRepository.findById(ticketPurchasedId)
                .orElse(null);
        // kiểm tra trạng thái
        if (ticketPurchased == null || !ticketPurchased.getStatus().equals(TicketPurchasedStatus.BINH_THUONG)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé của bạn không hợp lệ"));
        }
        // kiểm tra thời hạn
        if (!ticketPurchased.getExpires().isAfter(LocalDateTime.now())
                || ticketPurchased.getStartsValidity().isAfter(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé của bạn không có hiệu lực"));
        }
        // kiểm tra trạng thái sử dụng
        if (ticketPurchased.getUseStatus().equals(2)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé của bạn đang được sử dụng"));
        }
        // kiểm tra địa điểm sử dụng
        if (!ticketPurchased.getLocationId().equals(locationId)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé không hỗ trợ địa điểm này. Vui lòng sử dụng vé khác"));
        }
        Long useTimes = ticketPurchased.getUsedTimes() == null ? 1 : ticketPurchased.getUsedTimes() + 1;

        // đọc biển số
        String dataUrl = null;
        try {
            dataUrl = "data:" + file.getContentType() + ";base64," + convertToBase64(file);
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("image", dataUrl);
        Map<String, Object> response = readPlateClient.readPlate(payload);
        Object plateReturn = response.get("plate");

        if (plateReturn == null) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không đọc được biển số"));
        }
        String plate = plateReturn.toString();
        String imagePlateIn = "https://res.cloudinary.com/dis2ybh5i/image/upload/v1760105043/parking/" + uploadPlate(ticketPurchasedId, useTimes, dataUrl, "in");
        String imageVehicle = "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2023/7/25/base64-1690292751248363319489.png";
        String position = "A1";
        // thêm dữ liệu
        TicketInOut ticketInOut = TicketInOut.builder()
                .ticketPurchasedId(ticketPurchasedId)
                .numberCard(numberCard)
                .checkinAt(LocalDateTime.now())
                .checkinMethod(method)
                .contentPlateIn(plate)
                .imagePlateIn(imagePlateIn)
                .imageVehicleIn(imageVehicle)
                .locationId(locationId)
                .position(position)
                .build();
        DataUtils.setDataAction(ticketInOut, String.valueOf(locationId), true);
        ticketInOutRepository.save(ticketInOut);
        // lưu thông tin thay đổi vé
        ticketPurchased.setUseStatus(2);
        ticketPurchased.setUsedTimes(useTimes);
        DataUtils.setDataAction(ticketPurchased, String.valueOf(locationId), false);
        ticketPurchasedRepository.save(ticketPurchased);
        return ApiResponse.builder().build();
    }

    @Override
    public ApiResponse<Object> checkout(MultipartFile file, Integer method, String content, Long locationId) {
        String ticketPurchasedId;
        String numberCard = null;
        // valid phương thức
        if (method.equals(CheckingMethod.QR)) {
            // giải mã qr
            try {
                ticketPurchasedId = giaiMaQr(content);
            } catch (AppException e) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé của bạn không hợp lệ"));
            } catch (Exception e) {
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION.withMessage("Có lỗi trong quá trình xử lý. Vui lòng thử lại"));
            }
        } else if (method.equals(CheckingMethod.CARD)) {
            Card card = cardRepository.findByNumberCard(content)
                    .orElse(null);
            if (card == null || !card.getStatus().equals(CardStatus.DANG_HOAT_DONG)) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thẻ của bạn không hợp lệ"));
            }
            if (card.getTicketLink() == null) {
                throw new AppException(ErrorCode.INVALID_DATA.withMessage("Thẻ của bạn chưa liên kết vé"));
            }
            ticketPurchasedId = card.getTicketLink();
            numberCard = content;
        } else {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Phương thức không hỗ trợ"));
        }
        // xử lý thông tin
        TicketPurchased ticketPurchased = ticketPurchasedRepository.findById(ticketPurchasedId)
                .orElse(null);
        // kiểm tra trạng thái
        if (ticketPurchased == null || !ticketPurchased.getStatus().equals(TicketPurchasedStatus.BINH_THUONG)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé của bạn không hợp lệ"));
        }
        // kiểm tra thời hạn
        if (ticketPurchased.getExpires().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé của bạn không có hiệu lực"));
        }
        // kiểm tra trạng thái sử dụng
        if (!ticketPurchased.getUseStatus().equals(2)) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Vé của bạn chưa được sử dụng"));
        }
        // lấy thông tin checkin
        TicketInOut ticketInOut = ticketInOutRepository.findNewChecking(ticketPurchasedId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND.withMessage("không tìm thấy thông tin")));
        if (!locationId.equals(ticketInOut.getLocationId())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Sai địa điểm"));
        }

        // đọc biển số
        String dataUrl = null;
        try {
            dataUrl = "data:" + file.getContentType() + ";base64," + convertToBase64(file);
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_DATA);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("image", dataUrl);
        Map<String, Object> response = readPlateClient.readPlate(payload);
        Object plateReturn = response.get("plate");

        if (plateReturn == null) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Không đọc được biển số"));
        }
        String plate = plateReturn.toString();
        if (!plate.equals(ticketInOut.getContentPlateIn())) {
            throw new AppException(ErrorCode.INVALID_DATA.withMessage("Biển số không đúng"));
        }

        String imagePlateOut = "https://res.cloudinary.com/dis2ybh5i/image/upload/v1760105043/parking/" + uploadPlate(ticketPurchasedId, ticketPurchased.getUsedTimes(), dataUrl, "out");
        String imageVehicle = "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2023/7/25/base64-1690292751248363319489.png";
        // thêm dữ liệu
        ticketInOut.setCheckoutAt(LocalDateTime.now());
        ticketInOut.setImagePlateOut(imagePlateOut);
        ticketInOut.setImageVehicleOut(imageVehicle);
        ticketInOut.setContentPlateOut(plate);
        ticketInOut.setCheckoutMethod(method);
        ticketInOut.setNumberCard(numberCard);
        DataUtils.setDataAction(ticketInOut, String.valueOf(locationId), false);
        ticketInOutRepository.save(ticketInOut);
        // lưu thông tin thay đổi vé
        ticketPurchased.setUseStatus(1);
        DataUtils.setDataAction(ticketPurchased, String.valueOf(locationId), false);
        ticketPurchasedRepository.save(ticketPurchased);
        return ApiResponse.builder()
                .result(ticketInOut.getImagePlateIn())
                .build();
    }

    @Override
    public ApiResponse<Object> test(MultipartFile file) throws IOException {
        String dataUrl = "data:" + file.getContentType() + ";base64," + convertToBase64(file);
        Map<String, Object> payload = new HashMap<>();
        payload.put("image", dataUrl);
        return ApiResponse.builder()
                .result(readPlateClient.readPlate(payload))
                .build();
    }

    String uploadPlate(String ticket, Long turn, String image, String suffix) {
        String nameImage = ticket + "_" + turn + "_" + suffix;
        String folder = ECloudinary.FOLDER_PLATE.getValue();

        try {
            cloudinaryUploader.asyncUploadBase64Image(image, "parking/" + folder, nameImage);
            System.out.println(1);
        } catch (IOException e) {
            log.error("cloudinaryUploader error: ", e);
        }

        return folder + '/' + nameImage;
    }
}
