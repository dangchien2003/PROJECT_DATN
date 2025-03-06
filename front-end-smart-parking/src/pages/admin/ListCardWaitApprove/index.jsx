import Search from "./Search";
import TabStatus from "./TabStatus";
import { useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListCardWaitApprove from "@/components/TableListCardWaitApprove";

const ListCardWaitApprove = () => {
  const [searchTimes, setSearchTimes] = useState(0);
  const [dataSearch] = useState({
    emailOwner: null,
    type: null,
    issuedDateFrom: null,
    issuedDateTo: null,
    requestName: null,
    status: 0,
  });
  
  const propTabStatus = {
    onChange: (status) => {
      updateObjectValue(dataSearch, "status", status);
      onClickSearch();
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
      <TableListCardWaitApprove searchTimes={searchTimes} dataSearch={dataSearch} />
    </div>
  );
};

export default ListCardWaitApprove;
