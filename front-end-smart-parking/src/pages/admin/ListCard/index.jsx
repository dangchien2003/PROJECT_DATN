import Search from "./Search";
import TabStatus from "./TabStatus";
import { useEffect, useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListCard from "@/components/TableListCard";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_ADMIN_ID } from "@/utils/constants";

const ListCard = () => {  
  const { select } = useSelectMenu();
  
  useEffect(() => {
    select(MENU_ADMIN_ID.THE_DANH_SACH);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const { isSearching } = useSelector(state => state.startSearch)
  const dispatch = useDispatch();
  const [dataSearch] = useState({
    numberCard: null,
    emailOwner: null,
    type: null,
    issuedDate: null,
    requestName: null,
    status: 3,
  });

  const propTabStatus = {
    onChange: (status) => {
      updateObjectValue(dataSearch, "status", status);
      if (!isSearching) {
        dispatch(setSearching(true))
      }
    },
  };

  return (
    <div>
      <TabStatus {...propTabStatus} />
      <Search dataSearch={dataSearch} />
      <DividerCustom style={{ width: "80%" }} />
      <TableListCard dataSearch={dataSearch} />
    </div>
  );
};

export default ListCard;
