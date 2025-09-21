import AreaChartCustom from "@/components/AreaChartCustom";
import MonthYearSelect from "@/components/MonthYearSelect";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import SoTienThuDuocTheoThang from "./SoTienThuDuocTheoThang";
import ThongKeDoanhThuVaSoVeBanDuocAllDiaDiem from "./ThongKeDoanhThuVaSoVeBanDuocAllDiaDiem";
import Top5DiaDiemCoDoanhThuCaoNhat from "./Top5DiaDiemCoDoanhThuCaoNhat";
import { thongKeDoanhThuThangTheoDoiTac } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_PARTNER_ID } from "@/utils/constants";

const PartnerStatisticsBusiness = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_PARTNER_ID.BAO_CAO_THONG_KE_DOANH_THU);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const onChangeTime = ({ year, month }) => {
    setYear(year);
    setMonth(month);
  }
  const [dataArea, setDataArea] = useState({});
  useEffect(() => {
    if (year === undefined || month === undefined) {
      return;
    }
    thongKeDoanhThuThangTheoDoiTac(month, year).then(response => {
      const result = getDataApi(response);
      setDataArea(result);
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    })
  }, [year, month])
  return (
    <div className='PartnerStatisticsBusiness'>
      <MonthYearSelect onChange={onChangeTime} />
      <Row gutter={50} style={{ marginTop: 40 }}>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <SoTienThuDuocTheoThang year={year} />
          </div>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <div className='statistics-box-col'>
            <Top5DiaDiemCoDoanhThuCaoNhat year={year} month={month} />
          </div>
        </Col>
        <Col lg={24} md={24}>
          <ThongKeDoanhThuVaSoVeBanDuocAllDiaDiem year={year} month={month} />
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