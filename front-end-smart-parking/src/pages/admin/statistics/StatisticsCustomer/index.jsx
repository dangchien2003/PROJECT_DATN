import { Col, Row } from "antd";
import SoTaiKhoanTaoTrongThang from "./SoTaiKhoanTaoTrongThang";
import Top10TaiKhoanCoMucTieuDungCaoNhat from "./Top10TaiKhoanCoMucTieuDungCaoNhat";
import ThongKeTaiKhoanTheoTrangThai from "./ThongKeTaiKhoanTheoTrangThai";
import { useState } from "react";
import MonthYearSelect from "@/components/MonthYearSelect";

const StatisticsCustomer = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({year, month}) => {
    setYear(year);
    setMonth(month);
  }
  return (
    <div className='StatisticsCustomer'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <SoTaiKhoanTaoTrongThang year={year} month={month}/>
            <Top10TaiKhoanCoMucTieuDungCaoNhat year={year} month={month}/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className="statistics-box-col">
            <ThongKeTaiKhoanTheoTrangThai year={year} month={month}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCustomer;