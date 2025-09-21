import Search from "./Search";
import TabStatus from "./TabStatus";
import { useEffect, useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListLocationPartner from "@/components/TableListLocationPartner";
import { useRequireField } from "@/hook/useRequireField";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_PARTNER_ID } from "@/utils/constants";

const ListLocation = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_PARTNER_ID.QUAN_LY_DIA_DIEM_DANH_SACH);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const {resetRequireField} = useRequireField()
  const {isSearching} = useSelector(state => state.startSearch)
  const dispatch = useDispatch();

  const [dataSearch] = useState({
    name: null,
    openTime: null,
    closeTime: null,
    openHoliday: null,
    tab: 5,
    timeAppliedEdit: {
      value: null,
      trend: null
    },
    createdDate: [],
    category: null,
    urgentApprovalRequest: null
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
      <TableListLocationPartner dataSearch={dataSearch} />
    </div>
  );
};

export default ListLocation;
