import { Col, Row } from "antd";
import SoLuotThayDoiThongTin from "./SoLuotThayDoiThongTin";
import ThongKeDiaDiemTheoTrangThai from "./ThongKeDiaDiemTheoTrangThai";
import ThongKeLuotRaVaoTheoDiaDiemTrongThang from "./ThongKeLuotRaVaoTheoDiaDiemTrongThang";
import ThongKeDiaDiemCoNhieuVeHoTroNhat from "./ThongKeDiaDiemCoNhieuVeHoTroNhat";
import { useState } from "react";
import MonthYearSelect from "@/components/MonthYearSelect";

const PartnerStatisticsLocation = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({year, month}) => {
    setYear(year);
    setMonth(month);
  }
  return (
    <div className='PartnerStatisticsLocation'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoLuotThayDoiThongTin year={year} month={month}/>
            <ThongKeLuotRaVaoTheoDiaDiemTrongThang year={year} month={month}/>
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