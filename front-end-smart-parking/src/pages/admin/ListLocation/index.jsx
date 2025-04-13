import Search from "./Search";
import TabStatus from "./TabStatus";
import { useEffect, useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListLocation from "@/components/TableListLocation";
import { useRequireField } from "@/hook/useRequireField";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";

const ListLocation = () => {
  const {resetRequireField} = useRequireField()
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [dataSearch] = useState({
    partnerName: null,
    name: null,
    tab: 1,
    openTime: null,
    closeTime: null,
    capacity: null,
    openHoliday: null
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
      <TableListLocation dataSearch={dataSearch} />
    </div>
  );
};

export default ListLocation;
