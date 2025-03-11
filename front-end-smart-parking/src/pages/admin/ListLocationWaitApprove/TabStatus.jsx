import { Tabs } from "antd";
import React from "react";
const items = [
  {
    key: 3,
    label: "Thêm mới",
  },
  {
    key: 4,
    label: "Chỉnh sửa",
  },
  {
    key: 5,
    label: "Từ chối",
  },
];
const TabStatus = ({ ...prop }) => {
  return (
    <div className="tabs-ticket">
      <Tabs defaultActiveKey={1} items={items} {...prop} />
    </div>
  );
};

export default TabStatus;
