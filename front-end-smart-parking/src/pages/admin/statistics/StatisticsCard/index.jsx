import { Col, Row } from "antd";
import ThongKeTheoTrangThai from "./ThongKeTheoTrangThai";
import TiLeSuDungQrVaThe from "./TiLeSuDungQrVaThe";
import SoLuongXuLy from "./SoLuongXuLy";

const StatisticsCard = () => {
  return (
    <div className='StatisticsCard'>
      <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <ThongKeTheoTrangThai/>
            <TiLeSuDungQrVaThe/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoLuongXuLy/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCard;