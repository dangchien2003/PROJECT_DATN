import Search from "./Search";
import TabStatus from "./TabStatus";
import { useEffect, useState } from "react";
import "./style.css";
import TableListTicket from "@/components/TableListTicket";
import DividerCustom from "@/components/DividerCustom";
import { useDispatch } from "react-redux";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { changeInput } from "@/utils/handleChange";
import { setSearching } from "@/store/startSearchSlice";

const ListTicket = () => {
  const {resetRequireField} = useRequireField();
  const {reset} = useMessageError();
  const dispatch = useDispatch();
  const [dataSearch] = useState({
    ticketName: null,
    partnerName: null,
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
      changeInput(dataSearch, "tab", tab);
      dispatch(setSearching(true))
    },
  };

  useEffect(()=> {
    resetRequireField();
    reset();
  }, [resetRequireField])

  return (
    <div>
      <TabStatus {...propTabStatus} />
      <Search dataSearch={dataSearch} />
      <DividerCustom style={{ width: "80%" }} />
      <TableListTicket dataSearch={dataSearch} />
    </div>
  );
};

export default ListTicket;
