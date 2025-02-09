import { Tabs } from "antd";
import React from "react";
import TicketPurchased from "./TicketPurchased";
import Payment from "./Payment";
import UseTicket from "./UseTicket";

const StatisticalReport = ({ info }) => {
  const items = [
    {
      key: "1",
      label: "Sử dụng",
      children: <UseTicket info={info} />,
    },
    {
      key: "2",
      label: "Vé mua",
      children: <TicketPurchased info={info} />,
    },
    {
      key: "3",
      label: "Thanh toán",
      children: <Payment info={info} />,
    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} style={{ minHeight: 400 }} />
    </div>
  );
};

export default StatisticalReport;
