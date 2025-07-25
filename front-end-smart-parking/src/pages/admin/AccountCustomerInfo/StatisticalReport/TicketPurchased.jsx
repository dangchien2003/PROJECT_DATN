import TableCustomTicketPurchased from "@/components/TableCustomTicketPurchased";
import TkTicketPurchased from "@/components/TkTicketPurchased";
import { Col, Row } from "antd";
import React from "react";

const TicketPurchased = ({info}) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={16} lg={16}>
        <TableCustomTicketPurchased accountId={info.id}/>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8}>
        <TkTicketPurchased accountId={info.id}/>
      </Col>
    </Row>
  );
};

export default TicketPurchased;
