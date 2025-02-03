import TableCustomTicketPurchased from "@/components/TableCustomTicketPurchased";
import TkTicketPurchased from "@/components/TkTicketPurchased";
import React from "react";

const TicketPurchased = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div style={{ paddingRight: 16, width: 800 }}>
        <TableCustomTicketPurchased />
      </div>
      <div>
        <TkTicketPurchased />
      </div>
    </div>
  );
};

export default TicketPurchased;
