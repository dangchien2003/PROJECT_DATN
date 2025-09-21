import { Col, Row } from "antd";
import ThongKeTheoTrangThai from "./ThongKeTheoTrangThai";
import TiLeSuDungQrVaThe from "./TiLeSuDungQrVaThe";
import SoLuongXuLy from "./SoLuongXuLy";
import MonthYearSelect from "@/components/MonthYearSelect";
import { useEffect, useState } from "react";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_ADMIN_ID } from "@/utils/constants";

const StatisticsCard = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_ADMIN_ID.THONG_KE_THE);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({year, month}) => {
    setYear(year);
    setMonth(month);
  }
  return (
    <div className='StatisticsCard'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoLuongXuLy year={year} month={month}/>
            <TiLeSuDungQrVaThe year={year} month={month}/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <ThongKeTheoTrangThai/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsCard;