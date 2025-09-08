import { Col, Row } from "antd";
import LoaiKhachHang from "./LoaiKhachHang";
import Top10KhachHangChiTieuNhieuNhat from "./Top10KhachHangChiTieuNhieuNhat";

const PartnerStatisticsCustomer = () => {
  return (
    <div className='PartnerStatisticsCustomer'>
      <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <LoaiKhachHang/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top10KhachHangChiTieuNhieuNhat/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerStatisticsCustomer;