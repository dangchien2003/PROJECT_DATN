package com.example.parking_service.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public enum VNPAYTransactionStatus {
    S_00("00", "Giao dịch thành công"),
    S_01("01", "Giao dịch chưa hoàn tất"),
    S_02("02", "Giao dịch bị lỗi"),
    S_04("04", "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)"),
    S_05("05", "VNPAY đang xử lý giao dịch này (GD hoàn tiền)"),
    S_06("06", "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)"),
    S_07("07", "Giao dịch bị nghi ngờ gian lận"),
    S_08("08", "Giao dịch quá thời gian thanh toán"),
    S_09("09", "GD Hoàn trả bị từ chối"),
    S_10("10", "Đã giao hàng"),
    S_11("11", "Giao dịch bị hủy"),
    S_20("20", "Giao dịch đã được thanh quyết toán cho merchant"),
    ;
    String status;
    String description;
}
