import React from "react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Typography } from "antd";

const MenuAccount = ({ linkAvatar }) => {
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
      type: "divider",
    },
    {
      key: "3",
      label: (
        <a
          href="https://www.aliyun.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Đăng xuất
        </a>
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
