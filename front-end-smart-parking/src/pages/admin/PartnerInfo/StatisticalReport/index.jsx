import { Tabs } from "antd";
import React from "react";
import Ticket from "./Ticket";
import Map from "@/components/Map";
import SalesTicket from "./SalesTicket";
import Location from "./Location";

const StatisticalReport = ({ info }) => {
  const items = [
    {
      key: "1",
      label: "Vé",
      children: <Ticket info={info} />,
    },
    {
      key: "2",
      label: "Lượt bán",
      children: <SalesTicket info={info} />,
    },
    {
      key: "3",
      label: "Địa điểm",
      children: <Location info={info} />,
    },
    {
      key: "4",
      label: "Bản đồ",
      children: <Map style={{ height: 500 }} />,
    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} style={{ minHeight: 400 }} />
    </div>
  );
};

export default StatisticalReport;
