import TableCustomPayment from "@/components/TableCustomPayment";
import TkTicketPayment from "@/components/TkTicketPayment";
import { Col, Row } from "antd";
import React from "react";

const Payment = ({info}) => {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24} lg={24} style={{marginTop: 10}}>
        <TkTicketPayment accountId={info.id}/>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24}>
        <TableCustomPayment accountId={info.id}/>
      </Col>
    </Row>
  );
};

export default Payment;
