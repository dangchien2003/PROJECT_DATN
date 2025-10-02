import TableCustomTicketPurchased from "@/components/TableCustomTicketPurchased";
import TkTicketPurchased from "@/components/TkTicketPurchased";
import { Col, Row } from "antd";
import React from "react";

const TicketPurchased = ({info}) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24} lg={24}>
        <TableCustomTicketPurchased accountId={info.id}/>
      </Col>
    </Row>
  );
};

export default TicketPurchased;
