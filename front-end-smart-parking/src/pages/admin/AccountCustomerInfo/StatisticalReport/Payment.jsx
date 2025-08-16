import TableCustomPayment from "@/components/TableCustomPayment";
import TkTicketPayment from "@/components/TkTicketPayment";
import { Col, Row } from "antd";
import React from "react";

const Payment = ({info}) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={16} lg={16}>
        <TableCustomPayment accountId={info.id}/>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8}>
        <TkTicketPayment accountId={info.id}/>
      </Col>
    </Row>
  );
};

export default Payment;
