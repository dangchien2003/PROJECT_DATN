import TicketRevenueChart from '@/components/chart/TicketRevenueChart';
import { Col, Row } from 'antd';
import SoTienThuDuocTheoThang from './SoTienThuDuocTheoThang';
import './style.css';
import ThongKeSoDon from './ThongKeSoDon';
import Top5DoiTacCoDoanhThuCaoNhat from './Top5DoiTacCoDoanhThuCaoNhat';
import { useState } from 'react';
import MonthYearSelect from '@/components/MonthYearSelect';

const StatisticsBusiness = () => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({year, month}) => {
    setYear(year);
    setMonth(month);
  }
  return (
    <div className='statistics-business'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoTienThuDuocTheoThang year={year}/>
            <ThongKeSoDon year={year} month={month}/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top5DoiTacCoDoanhThuCaoNhat year={year} month={month}/>
            <TicketRevenueChart height={500} year={year} month={month}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsBusiness;