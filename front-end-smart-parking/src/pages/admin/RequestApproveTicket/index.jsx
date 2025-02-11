import { Tabs } from "antd";
import Search from "./Search";
import { useState } from "react";
import TableCustomListRequestCreateTicket from "@/components/TableCustomListRequestCreateTicket";
import DividerCustom from "@/components/DividerCustom";
import TableCustomListRequestEditTicket from "@/components/TableCustomListRequestEditTicket";

const items = [
  {
    key: 1,
    label: "Tạo mới",
  },
  {
    key: 2,
    label: "Chỉnh sửa",
  },
];
const RequestApproveTicket = () => {
  const [currentTab, setCurrentTab] = useState(items[0].key)
  const [searchTimes, setSearchTimes] = useState(0);
  const [dataSearch] = useState({
    ticketType: 1,
    partnerId: null,
    ticketName: null,
    releasedOrApplyTime: {
      time: null,
      order: null,
    },
    priceSearch: {
      price: null,
      order: null,
    },
    priceCategory: null,
    location: null,
    vehicle: null,
    urgent: true
  });

  const onClickSearch = () => {
    setSearchTimes((pre) => ++pre);
    console.log(dataSearch)
  };

  const onChangeTab = (value) => { 
    setCurrentTab(value); 
    dataSearch.ticketType = value 
  }

  return (
    <div>
      <div className="tabs-ticket">
        <Tabs defaultActiveKey={1} items={items} onChange={onChangeTab} />
      </div>
      <Search dataSearch={dataSearch} onSearch={onClickSearch} />
      <DividerCustom style={{ width: "80%" }} />
      {currentTab === 1 ? <TableCustomListRequestCreateTicket searchTimes={searchTimes} dataSearch={dataSearch} /> : <TableCustomListRequestEditTicket searchTimes={searchTimes} dataSearch={dataSearch} />}
    </div>
  )
}

export default RequestApproveTicket
