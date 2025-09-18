import { Col, Row } from "antd";
import SoLuotThayDoiThongTin from "./SoLuotThayDoiThongTin";
import Top5DoiTacCoNhieuDiaDiemNhat from "./Top5DoiTacCoNhieuDiaDiemNhat";
import ThongKeDiaDiemTheoTrangThai from "./ThongKeDiaDiemTheoTrangThai";
import Top5DiaDiemCoNhieuViTriNhat from "./Top5DiaDiemCoNhieuViTriNhat";
import { useState } from "react";
import MonthYearSelect from "@/components/MonthYearSelect";

const StatisticsLocation = () => {
   const [month, setMonth] = useState();
    const [year, setYear] = useState();
    const onChangeTime = ({year, month}) => {
      setYear(year);
      setMonth(month);
    }
  return (
    <div className='StatisticsLocation'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <SoLuotThayDoiThongTin year={year} month={month}/>
            <Top5DoiTacCoNhieuDiaDiemNhat year={year} month={month}/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <ThongKeDiaDiemTheoTrangThai/>
            <Top5DiaDiemCoNhieuViTriNhat year={year} month={month}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsLocation;