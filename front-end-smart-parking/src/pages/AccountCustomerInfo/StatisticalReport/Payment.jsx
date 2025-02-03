import TableCustomPayment from "@/components/TableCustomPayment";
import TkTicketPayment from "@/components/TkTicketPayment";
import React from "react";

const Payment = () => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div style={{ paddingRight: 16, width: 800 }}>
        <TableCustomPayment />
      </div>
      <div>
        <TkTicketPayment />
      </div>
    </div>
  );
};

export default Payment;
