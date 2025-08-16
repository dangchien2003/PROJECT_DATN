import { Tabs } from "antd";
import Location from "./Location";
import MapAllLoaction from "./MapAllLoaction";
import SalesTicket from "./SalesTicket";
import Ticket from "./Ticket";

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
      children: <MapAllLoaction info={info}/>,
    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} style={{ minHeight: 400 }} />
    </div>
  );
};

export default StatisticalReport;
