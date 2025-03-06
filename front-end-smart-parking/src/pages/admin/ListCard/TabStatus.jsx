import { Tabs } from "antd";
import React from "react";
const items = [
  {
    key: 3,
    label: "Đang hoạt động",
  },
  {
    key: 2,
    label: "Chờ kích hoạt",
  },
  {
    key: 1,
    label: "Chờ cấp",
  },
  {
    key: 4,
    label: "Tạm khoá",
  },
  {
    key: 5,
    label: "Khoá vĩnh viễn",
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
