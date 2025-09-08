import { Col, Row } from "antd";
import SoLuotMuaTheoLoaiVe from "./SoLuotMuaTheoLoaiVe";
import SoLuotThayDoiThongTin from "./SoLuotThayDoiThongTin";
import SoVeTheoLoai from "./SoVeTheoLoai";
import Top10VeCoLuotMuaCaoNhat from "./Top10VeCoLuotMuaCaoNhat";

const PartnerStatisticsTicket = () => {
  return (
    <div className='PartnerStatisticsTicket'>
       <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top10VeCoLuotMuaCaoNhat/>
            <SoVeTheoLoai/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoLuotThayDoiThongTin/>
            <SoLuotMuaTheoLoaiVe/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerStatisticsTicket;