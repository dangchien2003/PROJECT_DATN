import Search from "./Search";
import DividerCustom from "@/components/DividerCustom";
import TableCustomListAccountCustomer from "@/components/TableCustomListAccountCustomer";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_ADMIN_ID } from "@/utils/constants";
import { useEffect, useState } from "react";

const AccountCustomerList = () => {
  const { select } = useSelectMenu();
  
  useEffect(() => {
    select(MENU_ADMIN_ID.TAI_KHOAN_KHACH_HANG);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

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
