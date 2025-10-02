import TableCustomTicketOfPartner from "@/components/TableCustomTicketOfPartner";
import TableCustomTicketWaitApproveOfPartner from "@/components/TableCustomTicketWaitApproveOfPartner";
import TkTicketOfPartner from "@/components/TkTicketOfPartner";
import { Col, Row, Tabs } from "antd";
import React from "react";

const Ticket = ({ info }) => {
  const items = [
    {
      key: "1",
      label: "Đã duyệt",
      children: 
        <TableCustomTicketOfPartner accountId={info.id}/>,
    },
    {
      key: "2",
      label: "Chờ áp dụng",
      children: <TableCustomTicketWaitApproveOfPartner accountId={info.id} />,
    },
  ]
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24} lg={16}>
        <Tabs defaultActiveKey="1" items={items} style={{ minHeight: 400 }} destroyInactiveTabPane/>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8}>
        <TkTicketOfPartner accountId={info.id}/>
      </Col>
    </Row>
  );
};

export default Ticket;
