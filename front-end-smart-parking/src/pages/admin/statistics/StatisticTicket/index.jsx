import { Col, Row } from "antd";
import Top10VeCoLuotMuaCaoNhat from "./Top10VeCoLuotMuaCaoNhat";
import SoLuotMuaVeTheoLoai from "./SoLuotMuaVeTheoLoai";
import SoVeDangHoatDongTheoLoai from "./SoVeDangHoatDongTheoLoai";
import SoVeChinhSua from "./SoVeChinhSua";
import { useState } from "react";
import MonthYearSelect from "@/components/MonthYearSelect";

const StatisticTicket = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({ year, month }) => {
    setYear(year);
    setMonth(month);
  }
  return (
    <div className='StatisticTicket'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top10VeCoLuotMuaCaoNhat year={year} month={month}/>
            <SoLuotMuaVeTheoLoai year={year} month={month}/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoVeChinhSua year={year} month={month}/>
            <SoVeDangHoatDongTheoLoai year={year} month={month}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticTicket;