import { Col, Row } from "antd";
import SoLuongTaiKhoanDuocTao from "./SoLuongTaiKhoanDuocTao";
import ThongKeTheoTrangThai from "./ThongKeTheoTrangThai";
import ThongKeVeVaDiaDiem from "./ThongKeVeVaDiaDiem";
import MonthYearSelect from "@/components/MonthYearSelect";
import { useState } from "react";

const StatisticsPartner = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({year, month}) => {
    setYear(year);
    setMonth(month);
  }
  return (
    <div className='StatisticsPartner'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <SoLuongTaiKhoanDuocTao year={year} month={month}/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <ThongKeTheoTrangThai/>
          </div>
        </Col>
        <Col lg={24} md={24} sm={24} xs={24} >
          <div className="statistics-box-col">
            <ThongKeVeVaDiaDiem year={year} month={month}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPartner;