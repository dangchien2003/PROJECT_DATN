import { Col, Row } from "antd";
import SoLuotThayDoiThongTin from "./SoLuotThayDoiThongTin";
import Top5DoiTacCoNhieuDiaDiemNhat from "./Top5DoiTacCoNhieuDiaDiemNhat";
import ThongKeDiaDiemTheoTrangThai from "./ThongKeDiaDiemTheoTrangThai";
import Top5DiaDiemCoNhieuViTriNhat from "./Top5DiaDiemCoNhieuViTriNhat";

const StatisticsLocation = () => {
  return (
    <div className='StatisticsLocation'>
      <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <SoLuotThayDoiThongTin/>
            <Top5DoiTacCoNhieuDiaDiemNhat/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <ThongKeDiaDiemTheoTrangThai/>
            <Top5DiaDiemCoNhieuViTriNhat/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsLocation;