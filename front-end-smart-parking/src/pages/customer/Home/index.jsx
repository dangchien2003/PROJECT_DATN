import CardDashboard from "@/components/CardDashboard";
import ChildContent from "@/components/layout/Customer/ChildContent";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_CUSTOMER_ID } from "@/utils/constants";
import { Col, Flex, Row } from "antd";
import { useEffect } from "react";
import ticket2 from '@image/ticket2.png'
import location from '@image/location2.png'
import spending from '@image/spending.png'
import PieChartCustom from "@/components/chart/PieChartCustom";
import AreaChartCustom from "@/components/AreaChartCustom";

const Home = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_CUSTOMER_ID.TONG_QUAN);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const dataSoDonMuaDonMua = [
    { name: "Mua hộ", value: 10 },
    { name: "Cá nhân", value: 50 },
  ]
  const dataSoTienChiTieuTheoLoai = [
    { name: "Mua vé", value: 50000 },
    { name: "Gia hạn", value: 10000 },
    { name: "Nạp tiền", value: 10000 },
  ]
  
  const dataArea = {
    "x": [
      "01/09/2025",
      "02/09/2025",
      "03/09/2025",
      "04/09/2025",
      "05/09/2025",
      "06/09/2025",
      "07/09/2025",
      "08/09/2025",
      "09/09/2025",
      "10/09/2025",
      "11/09/2025",
      "12/09/2025",
      "13/09/2025",
      "14/09/2025",
      "15/09/2025",
      "16/09/2025",
      "17/09/2025",
      "18/09/2025",
      "19/09/2025",
      "20/09/2025",
      "21/09/2025",
      "22/09/2025",
      "23/09/2025",
      "24/09/2025",
      "25/09/2025",
      "26/09/2025",
      "27/09/2025",
      "28/09/2025",
      "29/09/2025",
      "30/09/2025"
    ],
    "y": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      5000,
      0,
      0
    ]
  }
  return (
    <div className='Home'>
      <ChildContent>
        <h2 className='page-name'>Tổng quan/thống kê</h2>
        <Row style={{ paddingTop: 20 }} gutter={24}>
          <Col lg={8} md={12} sm={12} xs={24}>
            <Flex justify="center">
              <CardDashboard label={"Số vé mua trong tháng"} value="50" icon={<img src={ticket2} style={{ width: 40 }} alt="Vé đã bán" />} />
            </Flex>
          </Col>
          <Col lg={8} md={12} sm={12} xs={24}>
            <Flex justify="center">
              <CardDashboard label={"Số địa điểm đã ghé qua"} value="10" borderColor="#FF8042" icon={<img src={location} style={{ width: 40 }} alt="Vé đã bán" />} />
            </Flex>
          </Col>
          <Col lg={8} md={16} sm={16} xs={24}>
            <Flex justify="center">
              <CardDashboard label={"Chi tiêu trong tháng"} value="50" borderColor="#00C49F" icon={<img src={spending} style={{ width: 40 }} alt="Vé đã bán" />} />
            </Flex>
          </Col>
        </Row>
        <Row style={{ paddingTop: 50 }} gutter={50}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <PieChartCustom nameChart={"Tỉ lệ đơn mua trong tháng"} data={dataSoDonMuaDonMua} />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <PieChartCustom nameChart={"Số tiền ra vào trong tháng"} data={dataSoTienChiTieuTheoLoai} />
          </Col>
        </Row>
        <Row style={{ paddingTop: 50 }} gutter={50}>
          <Col lg={24} md={24} sm={24} xs={24}>
            <AreaChartCustom
              data={dataArea}
              nameChart={"Biến động 30 ngày gần nhất"}
              height={500}
            />
          </Col>
        </Row>
      </ChildContent>
    </div>
  );
};

export default Home;