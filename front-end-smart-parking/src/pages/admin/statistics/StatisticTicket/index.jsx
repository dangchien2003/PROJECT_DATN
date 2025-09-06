import { Col, Row } from "antd";
import Top10VeCoLuotMuaCaoNhat from "./Top10VeCoLuotMuaCaoNhat";
import SoLuotMuaVeTheoLoai from "./SoLuotMuaVeTheoLoai";
import SoVeDangHoatDongTheoLoai from "./SoVeDangHoatDongTheoLoai";
import SoVeChinhSua from "./SoVeChinhSua";

const StatisticTicket = () => {
  return (
    <div className='StatisticTicket'>
      <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'> 
            <Top10VeCoLuotMuaCaoNhat/>
            <SoLuotMuaVeTheoLoai/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoVeChinhSua/>
            <SoVeDangHoatDongTheoLoai/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticTicket;