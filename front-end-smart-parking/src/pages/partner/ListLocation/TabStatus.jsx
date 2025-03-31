import { Tabs } from "antd";
import React from "react";
const items = [
  {
    key: 1,
    label: "Đang hoạt động",
  },
  {
    key: 2,
    label: "Tạm dừng hoạt động",
  },
  {
    key: 3,
    label: "Chờ duyệt",
  },
  {
    key: 4,
    label: "Từ chối",
  }
];
const TabStatus = ({ ...prop }) => {
  return (
    <div className="tabs-ticket">
      <Tabs defaultActiveKey={1} items={items} {...prop} />
    </div>
  );
};

export default TabStatus;
