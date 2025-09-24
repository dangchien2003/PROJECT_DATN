import "./style.css"
import { Tabs } from 'antd'
import React from 'react'
import ContentTab from "./ContentTab";
import dayjs from "dayjs";

const PositionUsed = ({ startTime, endTime, locationId, capacity }) => {
  const items = [];
  while(!startTime.isAfter(endTime)) {
    var format = startTime.format("DD/MM");
    items.push({
      key: format,
      label: <div className="custom-tab">{format}</div>,
      children: <ContentTab
        date={startTime.format("YYYY-MM-DD")}
        locationId={locationId}
        capacity={capacity}
        startTime={startTime}
        expires={null}
      />
    })
    startTime = startTime.add(1, 'day');
  }
  return (
    <div className="position-used">
      <h2 align="center">Tình trạng bãi đỗ</h2>
      <Tabs
        defaultActiveKey={dayjs().format("DD/MM")}
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
