import MonthYearSelect from '@/components/MonthYearSelect';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import SoTienThuDuocTheoThang from './SoTienThuDuocTheoThang';
import './style.css';
import ThongKeDiaDiemVoiVeBanVaDoanhThu from './ThongKeDiaDiemVoiVeBanVaDoanhThu';
import ThongKeSoDon from './ThongKeSoDon';
import Top5DoiTacCoDoanhThuCaoNhat from './Top5DoiTacCoDoanhThuCaoNhat';
import { useSelectMenu } from '@/hook/useSelectMenu';
import { MENU_ADMIN_ID } from '@/utils/constants';

const StatisticsBusiness = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_ADMIN_ID.THONG_KE_DOANH_THU);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({ year, month }) => {
    setYear(year);
    setMonth(month);
  }

  return (
    <div className='statistics-business'>
      <MonthYearSelect onChange={onChangeTime} />
      <Row gutter={50} style={{ marginTop: 40 }}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoTienThuDuocTheoThang year={year} />
            <ThongKeSoDon year={year} month={month} />
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top5DoiTacCoDoanhThuCaoNhat year={year} month={month} />
            <ThongKeDiaDiemVoiVeBanVaDoanhThu year={year} month={month} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsBusiness;