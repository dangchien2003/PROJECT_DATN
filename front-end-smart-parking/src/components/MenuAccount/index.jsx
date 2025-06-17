import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { deleteRefeshToken } from "@/service/localStorageService";
import { moveAccessToken } from "@/service/cookieService";
import './style.css'

const MenuAccount = ({ linkAvatar, isCustomer }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    deleteRefeshToken();
    moveAccessToken();
    navigate("/authen")
  }

  const items = [
    {
      key: "1",
      label: <a href="/account-info">Thông tin tài khoản</a>,
    },
    {
      key: "2",
      label: <a href="/account-info">Đổi mật khẩu</a>,
    },
    {
      key: "1.5",
      label: <Link to={"/account/transaction"}><div>Quản lý giao dịch</div></Link>,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <div onClick={handleLogout}>
          Đăng xuất
        </div>
      ),
    },
  ];
  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
      }}
      trigger={"click"}
      className="menu-account"
    >
      <Typography.Link>
        <Space>
          <img
            src={linkAvatar}
            alt="avatar"
            style={{ borderRadius: "50%", width: 50, height: 50 }}
          />
          <DownOutlined style={{ color: "black" }} />
        </Space>
      </Typography.Link>
    </Dropdown>
  );
};

export default MenuAccount;
