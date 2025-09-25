import { FaMotorcycle } from "react-icons/fa6";
import { FaCarAlt } from "react-icons/fa";

export const GENDER = [
  {
    value: 0,
    label: "Nam",
  },
  {
    value: 1,
    label: "Nữ",
  },
];

export const PRICE_CATEGORY = {
  TIME: {
    value: 1,
    label: "1 giờ",
  },
  DAY: {
    value: 2,
    label: "1 ngày",
  },
  WEEK: {
    value: 3,
    label: "1 tuần",
  },
  MONTH: {
    value: 4,
    label: "1 tháng",
  },
}

export const ACCOUNT_STATUS = [
  {
    value: 0,
    label: "Đã khoá",
  },
  {
    value: 1,
    label: "Khoá tạm thời",
  },
  {
    value: 2,
    label: "Đang hoạt động",
  },
];

export const ACCOUNT_STATUS_OBJECT = {
  0: "Đã khoá",
  1: "Khoá tạm thời",
  2: "Đang hoạt động",
};

export const COLOR_BUTTON_ACCOUNT_STATUS = {
  0: "danger",
  1: "default",
  2: "cyan",
  3: "warning",
};

export const PAYMENT_METHOD = {
  0: "Số dư",
  1: "Vnpay",
  2: "Banking",
};

export const PAYMENT_METHOD_VALUE = {
  SO_DU: 0,
  VNPAY: 1,
  BANKING: 2,
};

export const PAYMENT_TYPE = {
  0: "Mua vé",
  1: "Gia hạn vé",
  2: "Nạp tiền",
  3: "Thu hồi",
};

export const PAYMENT_STATUS = {
  0: {
    label: "Chờ thanh toán",
    color: "default",
  },
  1: {
    label: "Đang xử lý",
    color: "warning",
  },
  2: {
    label: "Thành công",
    color: "cyan",
  },
  3: {
    label: "Hết hạn",
    color: "danger",
  },
  4: {
    label: "Huỷ giao dịch",
    color: "danger",
  },
  5: {
    label: "Lỗi giao dịch",
    color: "danger",
  },
  6: {
    label: "Giao dịch thành công nhưng lỗi xử lý",
    color: "danger",
  },
};

export const COLORS_CHART = [
  "#0088FE", // Xanh dương
  "#00C49F", // Xanh lục
  "#FFBB28", // Vàng
  "#FF8042", // Cam
  "#A28DFF", // Tím nhạt
  "#FF6699", // Hồng
  "#66CCFF", // Xanh da trời nhạt
  "#33CC99", // Xanh lá mạ
];

export const COLOR = {
  _f6a621: "#f6a621",
  _00c49f: "#00c49f",
  _ff8042: "#ff8042",
};

export const VEHICLE = {
  0: {
    name: "Ô tô",
    icon: <FaCarAlt />,
    value: 0,
    label: <span><FaCarAlt /> <span>Ô tô</span></span>,
  },
  1: {
    name: "Xe máy",
    icon: <FaMotorcycle />,
    value: 1,
    label: <span><FaMotorcycle /> <span>Xe máy</span></span>,
  },
  2: {
    name: "Hỗn hợp",
    icon: (
      <>
        <FaCarAlt />
        <FaMotorcycle style={{ marginLeft: 4 }} />
      </>
    ),
    value: 2,
    label: (
      <span>
        <FaCarAlt />
        <FaMotorcycle style={{ marginLeft: 4 }} /> <span>Hỗn hợp</span>
      </span>
    ),
  },
};

export const VEHICLE_SELECTBOX = [
  {
    value: 0,
    label: <div><FaCarAlt /> <span>Ô tô</span></div>,
  },
  {
    value: 1,
    label: <div><FaMotorcycle /> <span>Xe máy</span></div>,
  },
  {
    value: 2,
    label: (
      <div>
        <FaCarAlt />
        <FaMotorcycle style={{ marginLeft: 4 }} /> Hỗn hợp
      </div>
    ),
  },
];

export const TICKET_PURCHASED_STATUS = {
  BINH_THUONG: {
    value: 0,
    label: "Bình thường",
    color: "cyan",
  },
  HUY_VE: {
    value: 1,
    label: "Huỷ vé",
    color: "default",
  },
  TAM_DINH_CHI: {
    value: 2,
    label: "Tạm đình chỉ",
    color: "danger",
  },
  BI_DINH_CHI: {
    value: 3,
    label: "Bị đình chỉ",
    color: "danger",
  },
};

export const TICKET_CATEGORY = {
  VE_GIO: {
    value: 1,
    label: "Vé giờ"
  },
  VE_NGAY: {
    value: 2,
    label: "Vé ngày"
  },
  VE_TUAN: {
    value: 3,
    label: "Vé tuần"
  },
  VE_THANG: {
    value: 4,
    label: "Vé tháng"
  },
}

export const TICKET_STATUS = {
  CHO_DUYET: {
    value: 0,
    label: "Chờ phát hành",
    color: "warning",
  },
  DANG_PHAT_HANH: {
    value: 1,
    label: "Đang phát hành",
    color: "cyan",
  },
  TAM_DUNG_PHAT_HANH: {
    value: 2,
    label: "Tạm dừng phát hành",
    color: "default",
  },
  DA_HUY: {
    value: 3,
    label: "Huỷ",
    color: "danger",
  },
  TU_CHOI: {
    value: 4,
    label: "Từ chối",
    color: "danger",
  },
};

export const LOCATION_STATUS = {
  0: {
    label: "Chờ duyệt",
    color: "warning",
  },
  1: {
    label: "Đang hoạt động", //Đã duyệt/Đang hoạt động
    color: "cyan",
  },
  3: {
    label: "Tạm dừng hoạt động",
    color: "default",
  },
  4: {
    label: "Ngừng hoạt động",
    color: "default",
  },
  5: {
    label: "Bị từ chối",
    color: "danger",
  },
};

export const LOCATION_STATUS_SELECRBOX = [
  { value: 0, label: "Chờ duyệt" },
  { value: 1, label: "Đang hoạt động" },
  { value: 3, label: "Tạm dừng hoạt động" },
  { value: 4, label: "Ngừng hoạt động" },
  { value: 5, label: "Bị từ chối" }
]

export const LOCALTION_MODIFY_STATUS = {
  CHO_DUYET: {
    value: 0,
    label: "Chờ duyệt",
    color: "warning",
  },
  BI_TU_CHOI: {
    value: 1,
    label: "Bị từ chối",
    color: "danger",
  },
  CHO_AP_DUNG: {
    value: 2,
    label: "Chờ áp dụng",
    color: "default",
  },
  DA_AP_DUNG: {
    value: 3,
    label: "Đã áp dụng",
    color: "cyan",
  },
};

export const TICKET_MODIFY_STATUS = {
  CHO_AP_DUNG: {
    value: 0,
    label: "Chờ áp dụng",
    color: "default",
  },
  HUY_AP_DUNG: {
    value: 1,
    label: "Huỷ áp dụng",
    color: "danger",
  },
  BI_TU_CHOI: {
    value: 2,
    label: "Bị từ chối áp dụng",
    color: "danger",
  },
  DA_AP_DUNG: {
    value: 3,
    label: "Đã áp dụng",
    color: "cyan",
  },
};


export const LOCATION_MODIFY_STATUS_SELECTBOX = [
  {
    label: "Chờ duyệt",
    value: 0,
  },
  {
    label: "Bị từ chối",
    value: 1,
  },
  {
    label: "Chờ áp dụng",
    value: 2,
  },
  {
    label: "Đã áp dụng",
    value: 3,
  },
];

export const TICKET_MODIFY_STATUS_SELECTBOX = [
  {
    label: "Chờ duyệt",
    value: 0,
  },
  {
    label: "Bị từ chối",
    value: 1,
  },
  {
    label: "Chờ áp dụng",
    value: 2,
  },
  {
    label: "Đã áp dụng",
    value: 3,
  },
];

export const CARD_STATUS_2 = {
  CHO_DUYET: {
    value: 0,
    label: "Chờ duyệt",
    color: "warning",
  },
  CHO_CAP: {
    value: 1,
    label: "Chờ cấp",
    color: "warning",
  },
  CHO_KICH_HOAT: {
    value: 2,
    label: "Chờ kích hoạt",
    color: "default",
  },
  DANG_HOAT_DONG: {
    value: 3,
    label: "Đang hoạt động",
    color: "cyan",
  },
  TAM_KHOA: {
    value: 4,
    label: "Tạm khoá",
    color: "danger",
  },
  KHOA_VINH_VIEN: {
    value: 5,
    label: "Khoá vĩnh viễn",
    color: "danger",
  },
  TU_CHOI: {
    value: 6,
    label: "Từ chối",
    color: "danger",
  },
}


export const CARD_STATUS = {
  0: {
    label: "Chờ duyệt",
    color: "warning",
  },
  1: {
    label: "Chờ cấp",
    color: "warning",
  },
  2: {
    label: "Chờ kích hoạt",
    color: "default",
  },
  3: {
    label: "Đang hoạt động",
    color: "cyan",
  },
  4: {
    label: "Tạm khoá",
    color: "danger",
  },
  5: {
    label: "Khoá vĩnh viễn",
    color: "danger",
  },
  6: {
    label: "Từ chối",
    color: "danger",
  },
}

export const CARD_TYPE = {
  0: {
    label: "Thẻ cá nhân",
  },
  1: {
    label: "Thẻ doanh nghiệp"
  },
}

export const CARD_TYPE_SELECTBOX = [
  {label: "Thẻ cá nhân", value: 0},
  {label: "Thẻ doanh nghiệp", value: 1},
]

export const DATA_OPEN_HOLIDAY = {
  DONG_CUA: {
    label: "Đóng cửa",
    value: 0,
  },
  MO_CUA: {
    label: "Mở cửa",
    value: 1,
  },
}

export const DATA_URGENT_APPROVAL_REQUEST = {
  KHONG: {
    label: "Không khẩn cấp",
    value: 0,
  },
  CO: {
    label: "Có khẩn cấp",
    value: 1,
  },
}

export const DATA_LOCATION_WAIT_APPROVE_CATEGORY_SELECTBOX = [
  {label: "Thêm mới", value: 1},
  {label: "Chỉnh sửa", value: 2},
]

export const DATA_LOCATION_WAIT_APPROVE_CATEGORY = {
  THEM_MOI: {
    label: "Thêm mới",
    value: 1,
  },
  CHINH_SUA: {
    label: "Chỉnh sửa",
    value: 2,
  },
}

export const TYPE_TRANSACTION = {
  MUA_VE: {
    label: "Mua vé",
    value: 0,
  },
  GIA_HAN_VE: {
    label: "Gia hạn vé",
    value: 1,
  },
  NAP_TIEN: {
    label: "Nạp tiền",
    value: 2,
  },
  THU_HOI: {
    label: "Thu hồi",
    value: 3,
  },
}

export const DATA_ACCOUNT_STATUS_SELECTBOX = [
  {label: "Khoá", value: 0},
  {label: "Tạm khoá", value: 1},
  {label: "Đang hoạt động", value: 2},
]

export const ACCOUNT_CATEGORY = {
  ADMIN: 0,
  PARTNER: 1,
  CUSTOMER: 2,
}

export const ACCOUNT_CATEGORY_NAME = [
  {code: 0, value: "Quản trị viên"},
  {code: 1, value: "Đối tác"},
  {code: 2, value: "Khách hàng"},
]

export const TYPE_AUTHEN = {
  USERNAME_PASSWORD: 1,
  GOOGLE: 2
}

export const KEY = {
  accessToken: "access",
  refreshToken: "refresh",
  rememberUser: "remember-username",
  googleCodeVerifier: "google-verifier",
  accountFullname: "account-fullname",
  partnerFullname: "partner-fullname",
  accountId: "identify",
  actor: "actor",
  avatar: "avatar",
}

export const REGEX_TEMPLATE = {
  email: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
  phoneNumber: "^(?:\\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$"
}

export const USERNAME_CATEGORY = {
  phoneNumber: 1,
  email: 2, 
}

export const lineLoading = {type: 2};

export const MENU_CUSTOMER_ID = {
  GIOI_THIEU: 0,
  TONG_QUAN: 1,
  NAP_TIEN: 2,
  DAT_VE: 3,
  VE_SU_DUNG: 4,
  QUAN_LY_THE: 5,
  LICH_SU_GIAO_DICH: 6,
  KHAC: null
}

export const MENU_ADMIN_ID = {
  TRANG_CHU: "1",

  TAI_KHOAN: "2",
  TAI_KHOAN_TAO_TAI_KHOAN: "2.1",
  TAI_KHOAN_KHACH_HANG: "2.2",
  TAI_KHOAN_DOI_TAC: "2.3",

  VE: "3",
  VE_DANH_SACH: "3.1",

  THE: "4",
  THE_DANH_SACH: "4.1",
  THE_YEU_CAU_THEM: "4.2",

  DIA_DIEM: "5",
  DIA_DIEM_BAN_DO: "5.1",
  DIA_DIEM_DANH_SACH: "5.2",
  DIA_DIEM_CHO_DUYET: "5.3",

  THONG_KE: "6",
  THONG_KE_DOANH_THU: "6.1",
  THONG_KE_VE: "6.2",
  THONG_KE_DIA_DIEM: "6.3",
  THONG_KE_THE: "6.4",
  THONG_KE_DOI_TAC: "6.5",
  THONG_KE_KHACH_HANG: "6.6",
};

export const MENU_PARTNER_ID = {
  TRANG_CHU: "1",

  QUAN_LY_DIA_DIEM: "2",
  QUAN_LY_DIA_DIEM_THEM: "2.1",
  QUAN_LY_DIA_DIEM_DANH_SACH: "2.2",

  QUAN_LY_VE: "3",
  QUAN_LY_VE_TAO_MOI: "3.1",
  QUAN_LY_VE_DANH_SACH: "3.2",

  BAO_CAO_THONG_KE: "5",
  BAO_CAO_THONG_KE_DOANH_THU: "5.1",
  BAO_CAO_THONG_KE_DIA_DIEM: "5.2",
  BAO_CAO_THONG_KE_VE: "5.3",
  BAO_CAO_THONG_KE_KHACH_HANG: "5.4",
};