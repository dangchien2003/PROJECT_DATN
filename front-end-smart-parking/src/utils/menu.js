import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { BsCart4 } from "react-icons/bs";
import { FaChartPie, FaLocationDot } from "react-icons/fa6";
import { IoCard, IoTicket } from "react-icons/io5";
import { TbPigMoney } from "react-icons/tb";
import { Link } from "react-router-dom";

export const ADMIN_MENU = [
  {
    key: "1",
    icon: <HomeOutlined style={{ fontSize: 20 }} />,
    label: <Link to={"/admin"}>Trang chủ</Link>,
  },
  {
    key: "2",
    icon: <UserOutlined style={{ fontSize: 20 }} />,
    label: "Tài khoản",
    children: [
      {
        key: "2.1",
        label: <Link to={"/admin/account/create"}>Tạo tài khoản</Link>,
      },
      {
        key: "2.2",
        label: <Link to={"/admin/account/customer"}>Khách hàng</Link>,
      },
      {
        key: "2.3",
        label: <Link to={"/admin/account/partner"}>Đối tác</Link>,
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
        label: <Link to={"/admin/ticket"}>Danh sách vé</Link>,
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
        label: <Link to={"/admin/card"}>Danh sách thẻ</Link>,
      },
      {
        key: "4.2",
        label: <Link to={"/admin/card/wait-approve"}>Yêu cầu thêm thẻ</Link>,
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
        label: <Link to={"/admin/location/map/all"}>Bản đồ</Link>,
      },
      {
        key: "5.2",
        label: <Link to={"/admin/location"}>Danh sách địa điểm</Link>,
      },
      {
        key: "5.3",
        label: <Link to={"/admin/location/wait-approve"}>Chờ duyệt</Link>,
      }
    ],
  },
  {
    key: "6",
    icon: <FaChartPie style={{ fontSize: 20 }} />,
    label: "Thống kê",
    children: [
      {
        key: "6.1",
        label: <Link to={"/admin/statistics/business"}>Doanh thu</Link>,
      },
      {
        key: "6.2",
        label: <Link to={"/admin/statistics/ticket"}>Vé</Link>,
      },
      {
        key: "6.3",
        label: <Link to={"/admin/statistics/location"}>Địa điểm</Link>,
      },
      {
        key: "6.4",
        label: <Link to={"/admin/statistics/card"}>Thẻ</Link>,
      },
      {
        key: "6.5",
        label: <Link to={"/admin/statistics/partner"}>Đối tác</Link>,
      },
      {
        key: "6.6",
        label: <Link to={"/admin/statistics/customer"}>Khách hàng</Link>,
      },
    ],
  },
];

export const PARTNER_MENU = [
  {
    key: "1",
    icon: <HomeOutlined style={{ fontSize: 20 }} />,
    label: <Link to={"/partner"}>Trang chủ</Link>,
  },
  {
    key: "2",
    icon: <FaLocationDot style={{ fontSize: 20 }} />,
    label: "Quản lý địa điểm",
    children: [
      {
        key: "2.1",
        label: <Link to={"/partner/location/add"}>Thêm địa điểm</Link>,
      },
      {
        key: "2.2",
        label: <Link to={"/partner/location/list"}>Danh sách địa điểm</Link>,
      },
    ],
  },
  {
    key: "3",
    icon: <IoTicket style={{ fontSize: 20 }} />,
    label: "Quản lý vé",
    children: [
      {
        key: "3.1",
        label: <Link to={"/partner/ticket/add"}>Tạo vé mới</Link>,
      },
      {
        key: "3.2",
        label: <Link to={"/partner/ticket/list"}>Vé đã tạo</Link>,
      },
    ],
  },
  {
    key: "5",
    icon: <FaChartPie style={{ fontSize: 20 }} />,
    label: "Báo cáo thống kê",
    children: [
      {
        key: "5.1",
        label: <Link to={"/partner/statistics/business"}>Doanh thu</Link>,
      },
      {
        key: "5.2",
        label: <Link to={"/partner/statistics/location"}>Địa điểm</Link>,
      },
      {
        key: "5.3",
        label: <Link to={"/partner/statistics/ticket"}>Vé</Link>,
      },
      {
        key: "5.4",
        label: <Link to={"/partner/statistics/customer"}>Khách hàng</Link>,
      },
    ],
  },
]

export const CUSTOMER_MENU = [
  {
    key: "1",
    icon: <HomeOutlined style={{ fontSize: 20 }} />,
    label: <Link to={"/home"}>Tổng quan</Link>,
  },
  {
    key: "2",
    icon: <TbPigMoney style={{ fontSize: 20 }} />,
    label: <Link to={"/deposit"}>Nạp tiền</Link>
  },
  {
    key: "3",
    icon: <BsCart4 style={{ fontSize: 20 }} />,
    label: <Link to={"/choose/location"}>Đặt vé</Link>
  },
  {
    key: "4",
    icon: <IoTicket style={{ fontSize: 20 }} />,
    label: <Link to={"/list/ticket"}>Vé sử dụng</Link>,
  },
  {
    key: "5",
    icon: <IoCard style={{ fontSize: 20 }} />,
    label: <Link to={"/card"}>Quản lý thẻ</Link>,
  },
];
