import "./style.css"
import { Tabs } from 'antd'
import React from 'react'
import ContentTab from "./ContentTab";
import dayjs from "dayjs";

const PositionUsed = ({ startTime, expires, locationId, capacity }) => {
  const start = startTime ? dayjs(startTime) : dayjs();
  const end = start.add(1, "month");
  const items = [];
  for (let i = 0; i <= 31; i++) {
    var current = start.add(i, 'day');
    var format = current.format("DD/MM");
    items.push({
      key: format,
      label: <div className="custom-tab">{format}</div>,
      children: <ContentTab
        date={current.format("YYYY-MM-DD")}
        locationId={locationId}
        capacity={capacity}
        startTime={startTime}
        expires={expires}
      />
    })
    if (current.isSame(end)) {
      break;
    }
  }
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        // onChange={onChange}
        tabPosition="top"
        type="line"
        tabBarGutter={8}
        animated
        destroyInactiveTabPane  
      />
    </div>
  )
}

export default PositionUsed
