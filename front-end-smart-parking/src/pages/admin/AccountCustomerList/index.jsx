import Search from "./Search";
import DividerCustom from "@/components/DividerCustom";
import TableCustomListAccountCustomer from "@/components/TableCustomListAccountCustomer";
import { useState } from "react";

const AccountCustomerList = () => {
  const [dataSearch] = useState({
    fullName: null,
    email: null,
    phoneNumber: null,
    gender: null,
    status: null,
    balance: {
      value: null,
      trend: null,
    }
  })
  return (
    <div>
      <Search dataSearch={dataSearch}/>
      <DividerCustom style={{ width: "80%" }} />
      <TableCustomListAccountCustomer dataSearch={dataSearch}/>
    </div>
  );
};

export default AccountCustomerList;
