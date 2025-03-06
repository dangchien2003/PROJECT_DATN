import { Tabs } from "antd";
import React from "react";
const items = [
  {
    key: 0,
    label: "Chờ duyệt",
  },
  {
    key: 6,
    label: "Đã từ chối",
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
