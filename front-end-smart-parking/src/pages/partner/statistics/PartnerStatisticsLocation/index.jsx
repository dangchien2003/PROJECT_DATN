import { Col, Row } from "antd";
import SoLuotThayDoiThongTin from "./SoLuotThayDoiThongTin";
import ThongKeDiaDiemTheoTrangThai from "./ThongKeDiaDiemTheoTrangThai";
import ThongKeLuotRaVaoTheoDiaDiemTrongThang from "./ThongKeLuotRaVaoTheoDiaDiemTrongThang";
import ThongKeDiaDiemCoNhieuVeHoTroNhat from "./ThongKeDiaDiemCoNhieuVeHoTroNhat";

const PartnerStatisticsLocation = () => {
  return (
    <div className='PartnerStatisticsLocation'>
      <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoLuotThayDoiThongTin/>
            <ThongKeLuotRaVaoTheoDiaDiemTrongThang/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <ThongKeDiaDiemTheoTrangThai/>
            <ThongKeDiaDiemCoNhieuVeHoTroNhat/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerStatisticsLocation;