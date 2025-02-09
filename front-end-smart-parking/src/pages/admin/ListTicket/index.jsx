import Search from "./Search";
import TabStatus from "./TabStatus";
import { useState } from "react";
import "./style.css";
import TableListTicket from "@/components/TableListTicket";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";

const ListTicket = () => {
  const [searchTimes, setSearchTimes] = useState(0);
  const [dataSearch] = useState({
    partnerId: null,
    ticketName: null,
    status: 1,
    modifyStatus: null,
    releasedTime: {
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
  });
  const propTabStatus = {
    onChange: (status) => {
      updateObjectValue(dataSearch, "status", status);
    },
  };

  const onClickSearch = () => {
    setSearchTimes((pre) => ++pre);
  };
  return (
    <div>
      <TabStatus {...propTabStatus} />
      <Search onSearch={onClickSearch} dataSearch={dataSearch} />
      <DividerCustom style={{ width: "80%" }} />
      <TableListTicket searchTimes={searchTimes} dataSearch={dataSearch} />
    </div>
  );
};

export default ListTicket;
