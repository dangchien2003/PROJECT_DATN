import { Col, Row } from "antd";
import LoaiKhachHang from "./LoaiKhachHang";
import Top10KhachHangChiTieuNhieuNhat from "./Top10KhachHangChiTieuNhieuNhat";
import { useEffect, useState } from "react";
import MonthYearSelect from "@/components/MonthYearSelect";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_PARTNER_ID } from "@/utils/constants";

const PartnerStatisticsCustomer = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_PARTNER_ID.BAO_CAO_THONG_KE_KHACH_HANG);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({year, month}) => {
    setYear(year);
    setMonth(month);
  }
  return (
    <div className='PartnerStatisticsCustomer'>
      <MonthYearSelect onChange={onChangeTime}/>
      <Row gutter={50} style={{marginTop: 40}}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <LoaiKhachHang year={year} month={month}/>
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top10KhachHangChiTieuNhieuNhat year={year} month={month}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PartnerStatisticsCustomer;