import LineLoading from "@/components/Loading/LineLoading";
import { useEffect, useState } from "react";
import Item from "./Item";
import { Flex } from "antd";
import './style.css'

const generateTimeSlots = (max) => {
  const slots = {};
  for (let h = 0; h < 24; h++) {
    slots["00:00"] = max;
    for (let m = 1; m < 60; m += 15) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      const time = `${hour}:${minute}`;
      slots[time] = Math.floor(Math.random() * max) + 1;
    }
  }
  return slots;
};

const ContentTab = ({ date }) => {
  const [data, setData] = useState(null);
  const [max] = useState(100);
  useEffect(() => {
    const id = setTimeout(() => {
      const generateTimeSlotsData = generateTimeSlots(max);
      setData(generateTimeSlotsData);
    }, 2000)
    return () => {
      clearTimeout(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div>
      {!data && <LineLoading />}
      {data && <Flex wrap className="content-tab hide-scrollbar">
        {Object.entries(data).map(([key, value]) => (
          <Item key={key} label={key} count={value} max={max} />
        ))}
      </Flex>}
    </div>
  );
};

export default ContentTab;