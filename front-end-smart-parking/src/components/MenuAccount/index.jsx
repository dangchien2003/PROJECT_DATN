import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';

const MenuAccount = ({ avatar }) => {
  const items = [
    // {
    //   key: '1',
    //   label: (
    //     <Link to="/account-info">
    //       Thông tin tài khoản
    //     </Link>
    //   ),
    // },
    // {
    //   key: '2',
    //   label: (
    //     <Link to="/account-info">
    //       Đổi mật khẩu
    //     </Link>
    //   ),
    // },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: (
        <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">
          Đăng xuất
        </a>
      ),
    },
  ];
  return (
    <Dropdown
      menu={{
        items,
        selectable: true
      }}
    >
      <Typography.Link>
        <Space>
          <img src={avatar} alt="avatar" style={{ borderRadius: '50%', width: 50, height: 50 }} />
          <DownOutlined />
        </Space>
      </Typography.Link>
    </Dropdown>
  )
}

export default MenuAccount
