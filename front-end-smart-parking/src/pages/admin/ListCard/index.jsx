import Search from "./Search";
import TabStatus from "./TabStatus";
import { useState } from "react";
import "./style.css";
import DividerCustom from "@/components/DividerCustom";
import { updateObjectValue } from "@/utils/object";
import TableListCard from "@/components/TableListCard";
import { useDispatch, useSelector } from "react-redux";
import { setSearching } from "@/store/startSearchSlice";

const ListCard = () => {
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
