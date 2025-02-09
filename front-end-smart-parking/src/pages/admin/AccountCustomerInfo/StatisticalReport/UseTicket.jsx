import TableCustomHistoryInOut from "@/components/TableCustomHistoryInOut";
import TkUseTicket from "@/components/TkUseTicket";
import React from "react";

const UseTicket = ({ info }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div style={{ paddingRight: 16, width: 800 }}>
        <TableCustomHistoryInOut />
      </div>
      <div>
        <TkUseTicket />
      </div>
    </div>
  );
};

export default UseTicket;
