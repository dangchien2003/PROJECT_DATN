import React, { useEffect, useState } from "react";
import Search from "./Search";
import DividerCustom from "@/components/DividerCustom";
import TableCustomListPartner from "@/components/TableCustomListPartner";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_ADMIN_ID } from "@/utils/constants";

const PartnerList = () => {  
  const { select } = useSelectMenu();
  
  useEffect(() => {
    select(MENU_ADMIN_ID.TAI_KHOAN_DOI_TAC);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  
  const [dataSearch] = useState({
    partnerFullName: null, 
    email: null, 
    phoneNumber: null, 
    status: null
  });
  return (
    <div>
      <Search dataSearch={dataSearch}/>
      <DividerCustom style={{ width: "80%" }} />
      <TableCustomListPartner dataSearch={dataSearch}/>
    </div>
  );
};

export default PartnerList;
