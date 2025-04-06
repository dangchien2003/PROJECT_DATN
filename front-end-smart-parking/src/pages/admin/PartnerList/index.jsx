import React, { useState } from "react";
import Search from "./Search";
import DividerCustom from "@/components/DividerCustom";
import TableCustomListPartner from "@/components/TableCustomListPartner";

const PartnerList = () => {
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
