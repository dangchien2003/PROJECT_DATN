import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Drawer, Dropdown, Space, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { deleteRefeshToken } from "@/service/localStorageService";
import { moveAccessToken } from "@/service/cookieService";
import './style.css'
import Avatar from "../Avatar";
import AccountInfo from "../AccountInfo";

const MenuAccount = ({ linkAvatar, isCustomer }) => {
  const [openAccountInfo, setOpenAccountInfo] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    deleteRefeshToken();
    moveAccessToken();
    navigate("/authen")
  }

  const showDrawer = () => {
    setOpenAccountInfo(true);
  };
  const onClose = () => {
    setOpenAccountInfo(false);
  };

  const items = [
    {
      key: "1",
      label: <div onClick={showDrawer}>Thông tin tài khoản</div>,
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
    <>
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
      <Drawer
        title="Thông tin Tài khoản"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={openAccountInfo}
      >
        <AccountInfo/>
      </Drawer>
    </>
  );
};

export default MenuAccount;
