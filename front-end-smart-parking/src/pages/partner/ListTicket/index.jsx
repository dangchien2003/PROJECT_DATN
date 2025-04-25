import Search from "./Search";
import TabStatus from "./TabStatus";
import { useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListTicketPartner from "@/components/TableListTicketPartner";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";

const ListTicket = () => {
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();

  const [dataSearch] = useState({
    ticketName: null,
    tab: 1,
    modifyStatus: null,
    releasedTime: {
      value: null,
      trend: null,
    },
    priceSearch: {
      value: null,
      trend: null,
    },
    priceCategory: null,
    locationName: null,
    vehicle: null,
  });

  const propTabStatus = {
    onChange: (tab) => {
      updateObjectValue(dataSearch, "tab", tab);
      if(!isSearching) {
        dispatch(setSearching(true))
      }
    },
  };

  const onClickSearch = () => {
  };
  return (
    <div>
      <TabStatus {...propTabStatus} />
      <Search onSearch={onClickSearch} dataSearch={dataSearch} />
      <DividerCustom style={{ width: "80%" }} />
      <TableListTicketPartner dataSearch={dataSearch} />
    </div>
  );
};

export default ListTicket;
