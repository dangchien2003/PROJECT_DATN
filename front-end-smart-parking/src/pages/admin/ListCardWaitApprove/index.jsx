import Search from "./Search";
import TabStatus from "./TabStatus";
import { useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListCardWaitApprove from "@/components/TableListCardWaitApprove";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";

const ListCardWaitApprove = () => {
  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [dataSearch] = useState({
    emailOwner: null,
    type: null,
    requestDate: null,
    status: 0,
    requestName: null
  });
  
  const propTabStatus = {
    onChange: (status) => {
      updateObjectValue(dataSearch, "status", status);
      if(!isSearching) {
        dispatch(setSearching(true))
      }
    },
  };

  return (
    <div>
      <TabStatus {...propTabStatus} />
      <Search dataSearch={dataSearch} />
      <DividerCustom style={{ width: "80%" }} />
      <TableListCardWaitApprove dataSearch={dataSearch} />
    </div>
  );
};

export default ListCardWaitApprove;
