import Search from "./Search";
import TabStatus from "./TabStatus";
import { useEffect, useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListTicketPartner from "@/components/TableListTicketPartner";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_PARTNER_ID } from "@/utils/constants";

const ListTicket = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_PARTNER_ID.QUAN_LY_VE_DANH_SACH);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
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
