import { Col, Row } from "antd";
import SoLuotMuaTheoLoaiVe from "./SoLuotMuaTheoLoaiVe";
import SoLuotThayDoiThongTin from "./SoLuotThayDoiThongTin";
import SoVeTheoLoai from "./SoVeTheoLoai";
import Top10VeCoLuotMuaCaoNhat from "./Top10VeCoLuotMuaCaoNhat";
import MonthYearSelect from "@/components/MonthYearSelect";
import { useEffect, useState } from "react";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_PARTNER_ID } from "@/utils/constants";

const PartnerStatisticsTicket = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_PARTNER_ID.BAO_CAO_THONG_KE_VE);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({year, month}) => {
    setYear(year);
    setMonth(month);
  }
  return (
    <div className='PartnerStatisticsTicket'>
      <MonthYearSelect onChange={onChangeTime}/>
       <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top10VeCoLuotMuaCaoNhat year={year} month={month}/>
            <SoVeTheoLoai/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoLuotThayDoiThongTin year={year} month={month}/>
            <SoLuotMuaTheoLoaiVe year={year} month={month}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerStatisticsTicket;