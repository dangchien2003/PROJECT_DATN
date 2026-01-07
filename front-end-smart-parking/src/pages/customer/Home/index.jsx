import CardDashboard from "@/components/CardDashboard";
import ChildContent from "@/components/layout/Customer/ChildContent";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_CUSTOMER_ID } from "@/utils/constants";
import location from '@image/location2.png';
import spending from '@image/spending.png';
import ticket2 from '@image/ticket2.png';
import { Col, Flex, Row, Segmented } from "antd";
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from "react";
import BienDong30Ngay from "./BienDong30Ngay";
import ChiTieuTrongThang from "./ChiTieuTrongThang";
import './style.css';
import TiLeDonMuaTrongThang from "./TiLeDonMuaTrongThang";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import { formatCurrency } from "@/utils/number";

const Home = () => {
  const now = useRef(dayjs());
  const { select } = useSelectMenu();
  const [tab, setTab] = useState("Tháng này");
  const [month, setMonth] = useState(now.current.month() + 1);
  const [year, setYear] = useState(now.current.year());
  useEffect(() => {
    select(MENU_CUSTOMER_ID.TONG_QUAN);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const onChangeMonth = (value) => {
    if (value === "Tháng trước") {
      const newDate = now.current.subtract(1, "month");
      setMonth(newDate.month() + 1);
      setYear(newDate.year());
    } else {
      setMonth(now.current.month() + 1);
      setYear(now.current.year());
    }
    setTab(value);
  }
  // thống kê card
  const [soVeMuaTrongThang, setSoVeMuaTrongThang] = useState(0);
  const [soDiaDiemGheQua, setSoDiaDiemGheQua] = useState(0);
  const [chiTieuTrongThang, setChiTieuTrongThang] = useState(0);
  const accountId = getAccountId();
  useEffect(() => {
    const query = `
      select coalesce(sum(quality_ticket), 0) as data from order_parking
      where payment_by = '${accountId}'
      and YEAR(created_at) = ${year}
      and month(created_at) = ${month}
      and status = 2
      UNION ALL
      select coalesce(count(DISTINCT location_id), 0) as data from ticket_in_out
      where created_by = '${accountId}'
        and YEAR(created_at) = ${year}
        and month(created_at) = ${month}
      UNION ALL
      select coalesce(sum(total), 0) as data from payment
      where payment_by = '${accountId}'
        and YEAR(created_at) = ${year}
        and month(created_at) = ${month}
      and status = 2 and fluctuation = 2`
    getDataStatistic(query).then(response => {
      setSoVeMuaTrongThang(response.data?.[0].data);
      setSoDiaDiemGheQua(response.data?.[1].data);
      setChiTieuTrongThang(formatCurrency(response.data?.[2].data) || 0);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [month, year])
  return (
    <div className='Home'>
      <ChildContent>
        <Flex justify="space-between">
          <h2 className='page-name'>Tổng quan/thống kê</h2>
          <Flex align="center">
            <div>
              <Segmented
                options={["Tháng trước", "Tháng này"]}
                value={tab}
                onChange={onChangeMonth}
                className="custom-segmented"
              />
            </div>
          </Flex>
        </Flex>
        <Row style={{ paddingTop: 20 }} gutter={24}>
          <Col lg={8} md={12} sm={12} xs={24}>
            <Flex justify="center">
              <CardDashboard label={"Số vé mua trong tháng"} value={soVeMuaTrongThang} icon={<img src={ticket2} style={{ width: 40 }} alt="ticket" />} />
            </Flex>
          </Col>
          <Col lg={8} md={12} sm={12} xs={24}>
            <Flex justify="center">
              <CardDashboard label={"Số địa điểm đã ghé qua"} value={soDiaDiemGheQua} borderColor="#FF8042" icon={<img src={location} style={{ width: 40 }} alt="location" />} />
            </Flex>
          </Col>
          <Col lg={8} md={16} sm={16} xs={24}>
            <Flex justify="center">
              <CardDashboard label={"Chi tiêu trong tháng"} value={chiTieuTrongThang} borderColor="#00C49F" icon={<img src={spending} style={{ width: 40 }} alt="ví" />} />
            </Flex>
          </Col>
        </Row>
        <Row style={{ paddingTop: 50 }} gutter={50}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <TiLeDonMuaTrongThang month={month} year={year} />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ChiTieuTrongThang month={month} year={year} />
          </Col>
        </Row>
        <Row style={{ paddingTop: 50 }} gutter={50}>
          <Col lg={24} md={24} sm={24} xs={24}>
            <BienDong30Ngay />
          </Col>
        </Row>
      </ChildContent>
    </div>
  );
};

export default Home;