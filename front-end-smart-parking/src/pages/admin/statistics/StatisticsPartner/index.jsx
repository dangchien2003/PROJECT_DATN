import { Col, Row } from "antd";
import SoLuongTaiKhoanDuocTao from "./SoLuongTaiKhoanDuocTao";
import ThongKeTheoTrangThai from "./ThongKeTheoTrangThai";
import ThongKeVeVaDiaDiem from "./ThongKeVeVaDiaDiem";

const StatisticsPartner = () => {
  return (
    <div className='StatisticsPartner'>
      <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <SoLuongTaiKhoanDuocTao />
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <ThongKeTheoTrangThai />
          </div>
        </Col>
        <Col lg={24} md={24} sm={24} xs={24} >
          <div className="statistics-box-col">
            <ThongKeVeVaDiaDiem />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPartner;