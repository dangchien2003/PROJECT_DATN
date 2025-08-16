import { default as TableCustomLocationOfParner} from "@/components/TableCustomLocationOfParner";
import TableLocationWaitApproveOfParner from "@/components/TableLocationWaitApproveOfParner";
import TableLocationWaitReleaseOfParner from "@/components/TableLocationWaitReleaseOfParner";
import TkLocationOfParner from "@/components/TkLocationOfParner";
import { Col, Row, Tabs } from "antd";

const Location = ({ info }) => {
  const items = [
      {
        key: "1",
        label: "Đã duyệt",
        children: 
          <TableCustomLocationOfParner partnerId={info.id}/>,
      },
      {
        key: "2",
        label: "Chờ áp dụng",
        children: <TableLocationWaitReleaseOfParner partnerId={info.id} />,
      },
      {
        key: "3",
        label: "Chờ duyệt",
        children: <TableLocationWaitApproveOfParner partnerId={info.id} />,
      },
    ]
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={24} lg={16}>
        <Tabs defaultActiveKey="1" items={items} style={{ minHeight: 400 }} destroyInactiveTabPane/>
      </Col>
      <Col xs={24} sm={24} md={24} lg={8}>
        <TkLocationOfParner partnerId={info.id}/>
      </Col>
    </Row>
  );
};

export default Location;
