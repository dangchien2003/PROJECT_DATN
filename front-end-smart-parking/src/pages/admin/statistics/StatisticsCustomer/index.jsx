import { Col, Row } from "antd";
import SoTaiKhoanTaoTrongThang from "./SoTaiKhoanTaoTrongThang";
import Top10TaiKhoanCoMucTieuDungCaoNhat from "./Top10TaiKhoanCoMucTieuDungCaoNhat";
import ThongKeTaiKhoanTheoTrangThai from "./ThongKeTaiKhoanTheoTrangThai";

const StatisticsCustomer = () => {
  return (
    <div className='StatisticsCustomer'>
      <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <SoTaiKhoanTaoTrongThang/>
            <Top10TaiKhoanCoMucTieuDungCaoNhat/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <ThongKeTaiKhoanTheoTrangThai/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCustomer;