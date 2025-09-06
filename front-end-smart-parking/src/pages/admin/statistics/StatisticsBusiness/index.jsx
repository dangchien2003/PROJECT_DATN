import TicketRevenueChart from '@/components/chart/TicketRevenueChart';
import { Col, Row } from 'antd';
import SoTienThuDuocTheoThang from './SoTienThuDuocTheoThang';
import './style.css';
import ThongKeSoDon from './ThongKeSoDon';
import Top5DoiTacCoDoanhThuCaoNhat from './Top5DoiTacCoDoanhThuCaoNhat';

const StatisticsBusiness = () => {
  return (
    <div className='statistics-business'>
      <Row gutter={50}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='box-col'>
            <SoTienThuDuocTheoThang />
            <ThongKeSoDon/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='box-col'>
            <Top5DoiTacCoDoanhThuCaoNhat />
            <TicketRevenueChart height={500}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsBusiness;