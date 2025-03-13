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
    tab: 3,
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
    onChange: (tab) => {
      updateObjectValue(dataSearch, "tab", tab);
      let status = null;
      if(tab === 3) {
        status = 1;
      }else if(tab === 4) {
        status = 2;
      }else if(tab === 5) {
        status = 0;
      }
      updateObjectValue(dataSearch, "status", status);
      onClickSearch();
    },
  };

  const onClickSearch = () => {
    console.log(dataSearch)
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
