import { Tabs } from "antd";
import React from "react";
const items = [
  {
    key: 1,
    label: "Đang phát hành",
  },
  {
    key: 2,
    label: "Tạm dừng phát hành",
  },
  {
    key: 3,
    label: "Chờ áp dụng",
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
