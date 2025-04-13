import Search from "./Search";
import TabStatus from "./TabStatus";
import { useEffect, useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListLocationWaitApprove from "@/components/TableListLocationWaitApprove";
import { useDispatch, useSelector } from "react-redux";
import { useRequireField } from "@/hook/useRequireField";
import { setSearching } from "@/store/startSearchSlice";

const ListLocationWaitApprove = () => {
  const {resetRequireField} = useRequireField()
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [dataSearch] = useState({
    partnerName: null,
    createdAt: {
      value: null,
      trend: null,
    },
    timeAppliedEdit: {
      value: null,
      trend: null,
    },
    urgentApprovalRequest: null,
    tab: 3
  });
  useEffect(()=> {
    resetRequireField()
  }, [resetRequireField])

  const propTabStatus = {
    onChange: (tab) => {
      updateObjectValue(dataSearch, "tab", tab);
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
      <TableListLocationWaitApprove dataSearch={dataSearch} />
    </div>
  );
};

export default ListLocationWaitApprove;
