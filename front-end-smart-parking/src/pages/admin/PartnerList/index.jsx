import React from "react";
import Search from "./Search";
import DividerCustom from "@/components/DividerCustom";
import TableCustomListPartner from "@/components/TableCustomListPartner";

const PartnerList = () => {
  return (
    <div>
      <Search />
      <DividerCustom style={{ width: "80%" }} />
      <TableCustomListPartner />
    </div>
  );
};

export default PartnerList;
