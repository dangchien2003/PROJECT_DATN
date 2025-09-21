import Search from "./Search";
import TabStatus from "./TabStatus";
import { useEffect, useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListCardWaitApprove from "@/components/TableListCardWaitApprove";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_ADMIN_ID } from "@/utils/constants";

const ListCardWaitApprove = () => {  
  const { select } = useSelectMenu();
  
  useEffect(() => {
    select(MENU_ADMIN_ID.THE_YEU_CAU_THEM);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

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
