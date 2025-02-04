import TableCustomSaleTicketOfPartner from "@/components/TableCustomSaleTicketOfPartner";
import TkSaleTicketOfPartner from "@/components/TkSaleTicketOfPartner";

const SalesTicket = ({ info }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div style={{ paddingRight: 16, width: 800 }}>
        <TableCustomSaleTicketOfPartner />
      </div>
      <div>
        <TkSaleTicketOfPartner />
      </div>
    </div>
  );
};

export default SalesTicket;
