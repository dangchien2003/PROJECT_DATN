import { Link } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { IoTicket, IoCard } from "react-icons/io5";
import { FaLocationDot, FaChartPie } from "react-icons/fa6";

export const ADMIN_MENU = [
  {
    key: "1",
    icon: <HomeOutlined style={{ fontSize: 20 }} />,
    label: <Link to={"/"}>Dashboard</Link>,
  },
  {
    key: "2",
    icon: <UserOutlined style={{ fontSize: 20 }} />,
    label: "Tài khoản",
    children: [
      {
        key: "2.1",
        label: <Link to={"/account/create"}>Tạo tài khoản</Link>,
      },
      {
        key: "2.2",
        label: <Link to={"/account/customer"}>Khách hàng</Link>,
      },
      {
        key: "2.3",
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
        label: <Link to={"/ticket"}>Danh sách vé</Link>,
      },
      {
        key: "3.2",
        label: <Link to={"/ticket/request"}>Yêu cầu duyệt vé</Link>,
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
        label: <Link to={"/card"}>Danh sách thẻ</Link>,
      },
      {
        key: "4.2",
        label: <Link to={"/card/wait-approve"}>Yêu cầu thêm thẻ</Link>,
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
        label: <Link to={"/map/all"}>Bản đồ</Link>,
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
