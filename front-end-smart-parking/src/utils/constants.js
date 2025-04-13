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

export const PRICE_CATEGORY = [
  {
    value: 1,
    label: "1 giờ",
  },
  {
    value: 2,
    label: "1 ngày",
  },
  {
    value: 3,
    label: "1 tuần",
  },
  {
    value: 4,
    label: "1 tháng",
  },
];

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
    label: "Thất bại",
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
  },
  1: {
    name: "Xe máy",
    icon: <FaMotorcycle />,
  },
  2: {
    name: "Hỗn hợp",
    icon: (
      <>
        <FaCarAlt />
        <FaMotorcycle style={{ marginLeft: 4 }} />
      </>
    ),
  },
};

export const VEHICLE_SELECTBOX = [
  {
    value: 0,
    label: <FaCarAlt />,
  },
  {
    value: 1,
    label: <FaMotorcycle />,
  },
  {
    value: 2,
    label: (
      <>
        <FaCarAlt />
        <FaMotorcycle style={{ marginLeft: 4 }} />
      </>
    ),
  },
];

export const TICKET_STATUS = {
  0: {
    label: "Chờ duyệt",
    color: "warning",
  },
  1: {
    label: "Đang phát hành",
    color: "cyan",
  },
  2: {
    label: "Tạm dừng phát hành",
    color: "default",
  },
  3: {
    label: "Đã huỷ",
    color: "danger",
  },
  4: {
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

export const MODIFY_STATUS = {
  0: {
    label: "Chờ duyệt",
    color: "warning",
  },
  1: {
    label: "Bị từ chối",
    color: "danger",
  },
  2: {
    label: "Chờ áp dụng",
    color: "default",
  },
  3: {
    label: "Đã áp dụng",
    color: "cyan",
  },
};
export const MODIFY_STATUS_SELECTBOX = [
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
    label: "Chờ cấp",
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