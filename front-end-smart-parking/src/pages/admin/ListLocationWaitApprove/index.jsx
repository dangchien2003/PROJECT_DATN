import Search from "./Search";
import TabStatus from "./TabStatus";
import { useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListLocationWaitApprove from "@/components/TableListLocationWaitApprove";

const ListLocationWaitApprove = () => {
  const [searchTimes, setSearchTimes] = useState(0);
  const [dataSearch] = useState({
    partnerName: null,
    type: 1,
    releasedOrApplyTime: {
      time: null,
      order: null,
    },
    urgent: true,
  });
  const propTabStatus = {
    onChange: (status) => {
      updateObjectValue(dataSearch, "type", status);
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
      <TableListLocationWaitApprove searchTimes={searchTimes} dataSearch={dataSearch} />
    </div>
  );
};

export default ListLocationWaitApprove;
