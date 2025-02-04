import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { IoTicket, IoCard } from "react-icons/io5";
import { FaLocationDot, FaChartPie, FaMotorcycle } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaCarAlt } from "react-icons/fa";

export const ADMIN_MENU = [
  {
    key: "1",
    icon: <HomeOutlined style={{ fontSize: 20 }} />,
    label: <Link to={"/dashboard"}>Dashboard</Link>,
  },
  {
    key: "2",
    icon: <UserOutlined style={{ fontSize: 20 }} />,
    label: "Tài khoản",
    children: [
      {
        key: "2.1",
        label: <Link to={"/account/customer"}>Khách hàng</Link>,
      },
      {
        key: "2.2",
        label: <Link to={"/account/partner"}>Đối tác</Link>,
      },
    ],
  },
  {
    key: "3",
    icon: <IoTicket style={{ fontSize: 20 }} />,
    label: "Vé",
    children: [
      {
        key: "3.1",
        label: "Danh sách vé",
      },
      {
        key: "3.2",
        label: "Yêu cầu thêm vé",
      },
    ],
  },
  {
    key: "4",
    label: "Thẻ",
    icon: <IoCard style={{ fontSize: 20 }} />,
    children: [
      {
        key: "4.1",
        label: "Danh sách thẻ",
      },
      {
        key: "4.2",
        label: "Yêu cầu thêm thẻ",
      },
    ],
  },
  {
    key: "5",
    label: "Địa điểm",
    icon: <FaLocationDot style={{ fontSize: 20 }} />,
    children: [
      {
        key: "5.1",
        label: "Bản đồ",
      },
      {
        key: "5.2",
        label: "Danh sách địa điểm",
      },
      {
        key: "5.3",
        label: "Yêu cầu thêm địa điểm",
      },
      {
        key: "5.4",
        label: "Yêu cầu chỉnh sửa",
      },
    ],
  },
  {
    key: "6",
    icon: <FaChartPie style={{ fontSize: 20 }} />,
    label: "Thống kê",
    children: [
      {
        key: "6.1",
        label: "Doanh thu",
      },
      {
        key: "6.2",
        label: "Vé",
      },
      {
        key: "6.3",
        label: "Phương tiện",
      },
    ],
  },
];

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
    label: "Chờ duyệt thay đổi",
    color: "warning",
  },
  1: {
    label: "Từ chối thay đổi",
    color: "danger",
  },
  2: {
    label: "Chờ áp dụng thay đổi",
    color: "cyan",
  },
};
