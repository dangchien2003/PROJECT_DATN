import TableCustomTicketOfPartner from "@/components/TableCustomTicketOfPartner";
import TkTicketOfPartner from "@/components/TkTicketOfPartner";
import React from "react";

const Ticket = ({ info }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div style={{ paddingRight: 16, width: 800 }}>
        <TableCustomTicketOfPartner />
      </div>
      <div>
        <TkTicketOfPartner />
      </div>
    </div>
  );
};

export default Ticket;
