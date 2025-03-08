import Search from "./Search";
import TabStatus from "./TabStatus";
import { useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListLocation from "@/components/TableListLocation";

const ListLocation = () => {
  const [searchTimes, setSearchTimes] = useState(0);
  const [dataSearch] = useState({
    partnerName: null,
    name: null,
    status: 1,
    modifyStatus: null,
    openTime: null,
    closeTime: null,
    capacity: null
  });
  const propTabStatus = {
    onChange: (status) => {
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
      <TableListLocation searchTimes={searchTimes} dataSearch={dataSearch} />
    </div>
  );
};

export default ListLocation;
