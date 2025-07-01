import "./style.css"
import { Tabs } from 'antd'
import React from 'react'
import ContentTab from "./ContentTab";
import dayjs from "dayjs";

const PositionUsed = ({startTime}) => {
  const onChange = key => {
    console.log(key);
  };
  const start = startTime ? dayjs(startTime) : dayjs();
  const end = start.add(1, "month");
  const items = [
    {
      key: start.format("DD/MM"),
      label: <div className="custom-tab">{start.format("DD/MM")}</div>,
      children: <ContentTab time={start}/>
    }
  ];
  
  for(let i = 1; i <= 31; i++) {
    var current = start.add(i, 'day');
    var format = current.format("DD/MM");
    items.push({
      key: format,
      label: <div className="custom-tab">{format}</div>,
      children: <ContentTab time={current}/>
    })
    if(current.isSame(end)) {
      break;
    }
  }
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        tabPosition="top"
        type="line"
        tabBarGutter={8}
        animated
      />
    </div>
  )
}

export default PositionUsed
