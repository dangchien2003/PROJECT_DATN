import { Col, Row } from "antd";
import SoTienThuDuocTheoThang from "./SoTienThuDuocTheoThang";
import Top5DiaDiemCoDoanhThuCaoNhat from "./Top5DiaDiemCoDoanhThuCaoNhat";
import TicketRevenueChart from "./TicketRevenueChart";
import AreaChartCustom from "@/components/AreaChartCustom";
import { useState } from "react";
import MonthYearSelect from "@/components/MonthYearSelect";

const PartnerStatisticsBusiness = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({year, month}) => {
    setYear(year);
    setMonth(month);
  }
  const dataArea = {
    "x": [
      "01/09/2025",
      "02/09/2025",
      "03/09/2025",
      "04/09/2025",
      "05/09/2025",
      "06/09/2025",
      "07/09/2025",
      "08/09/2025",
      "09/09/2025",
      "10/09/2025",
      "11/09/2025",
      "12/09/2025",
      "13/09/2025",
      "14/09/2025",
      "15/09/2025",
      "16/09/2025",
      "17/09/2025",
      "18/09/2025",
      "19/09/2025",
      "20/09/2025",
      "21/09/2025",
      "22/09/2025",
      "23/09/2025",
      "24/09/2025",
      "25/09/2025",
      "26/09/2025",
      "27/09/2025",
      "28/09/2025",
      "29/09/2025",
      "30/09/2025"
    ],
    "y": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      5000,
      0,
      0
    ]
  }
  return (
    <div className='PartnerStatisticsBusiness'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoTienThuDuocTheoThang year={year}/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top5DiaDiemCoDoanhThuCaoNhat year={year} month={month}/>
          </div>
        </Col>
        <Col lg={24} md={24}>
          <TicketRevenueChart year={year} month={month}/>
        </Col>
        <Col lg={24} md={24}>
         <AreaChartCustom
          data={dataArea}
          nameChart={`Biến động dòng tiền qua các ngày - tháng ${month}/${year}`}
          height={500}
        />
        </Col>
      </Row>
    </div>
  );
};

export default PartnerStatisticsBusiness;