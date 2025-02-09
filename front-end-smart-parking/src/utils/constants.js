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

export const MODIFY_STATUS = {
  0: {
    label: "Không có thay đổi",
    color: "default",
  },
  1: {
    label: "Chờ duyệt thay đổi",
    color: "warning",
  },
  2: {
    label: "Từ chối thay đổi",
    color: "danger",
  },
  3: {
    label: "Chờ áp dụng thay đổi",
    color: "cyan",
  },
};
export const MODIFY_STATUS_SELECTBOX = [
  {
    label: "Không có thay đổi",
    value: 0,
  },
  {
    label: "Chờ duyệt thay đổi",
    value: 1,
  },
  {
    label: "Từ chối thay đổi",
    value: 2,
  },
  {
    label: "Chờ áp dụng thay đổi",
    value: 3,
  },
];
