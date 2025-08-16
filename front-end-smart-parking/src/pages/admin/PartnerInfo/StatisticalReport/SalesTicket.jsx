import TableCustomSaleTicketOfPartner from "@/components/TableCustomSaleTicketOfPartner";
import TkSaleTicketOfPartner from "@/components/TkSaleTicketOfPartner";
import { Col, Row } from "antd";

const SalesTicket = ({ info }) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24} lg={17}>
        <TableCustomSaleTicketOfPartner partnerId={info.id}/>
      </Col>
      <Col xs={24} sm={24} md={24} lg={7}>
        <TkSaleTicketOfPartner partnerId={info.id}/>
      </Col>
    </Row>
  );
};

export default SalesTicket;
