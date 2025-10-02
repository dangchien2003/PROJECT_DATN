import PieChartCustom from "@Components/chart/PieChartCustom";
import { formatCurrency } from "@/utils/number";
import { useEffect, useState } from "react";
import { getDataStatistic } from "@/service/statisticalService";
import { toastError } from "@/utils/toast";
import { getDataApi } from "@/utils/api";
import { Col, Row } from "antd";

const TkTicketPayment = ({ accountId }) => {
  const [pie1, setPie1] = useState([]);
  const [pie2, setPie2] = useState([]);
  const [pie3, setPie3] = useState([]);
  const query1 = `
    with typeName as (
    select 0 as type, 'Mua vé' as name
    union all
    select 1 as type, 'Gia hạn vé' as name
    union all
    select 2 as type, 'Nạp tiền' as name
    union all
    select 3 as type, 'Thu hồi' as name
)
select t.name, count(p.payment_id) as count
from typeName t
         left join payment p
                   on t.type = p.type
                       and p.payment_by = '${accountId}'
                       and p.status = 2
group by t.type, t.name
order by t.type;
  `
  useEffect(() => {
    if (!accountId) {
      return;
    }
    getDataStatistic(query1).then(response => {
      const data = [];
      response.data.forEach(item => data.push({ name: item.name, value: item.count }));
      setPie1(data);
    }).catch(e => {
      toastError(getDataApi(e).message)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [accountId])
  const query2 = `
    with typeName as (
    select 0 as type, 'Mua vé' as name
    union all
    select 1 as type, 'Gia hạn vé' as name
    union all
    select 2 as type, 'Nạp tiền' as name
    union all
    select 3 as type, 'Thu hồi' as name
)
select t.name, sum(p.total) as total
from typeName t
         left join payment p
                   on t.type = p.type
                       and p.payment_by = '${accountId}'
                       and p.status = 2
group by t.type, t.name
order by t.type;
  `
  useEffect(() => {
    if (!accountId) {
      return;
    }
    getDataStatistic(query2).then(response => {
      const data = [];
      response.data.forEach(item => data.push({ name: item.name, value: item.total }));
      setPie2(data);
    }).catch(e => {
      toastError(getDataApi(e).message)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [accountId])
  const query3 = `
    with methodName as (
    select 0 as id, 'Số dư' as name
    union all
    select 1 as id, 'VNPay' as name
    union all
    select 2 as id, 'Banking' as name
)
select t.name, count(p.payment_method) as count
from methodName t
         left join payment p
                   on t.id = p.payment_method
                       and p.payment_by = '${accountId}'
                       and p.status = 2
group by t.id, t.name
order by t.id;
  `
  useEffect(() => {
    if (!accountId) {
      return;
    }
    getDataStatistic(query3).then(response => {
      const data = [];
      response.data.forEach(item => data.push({ name: item.name, value: item.count }));
      setPie3(data);
    }).catch(e => {
      toastError(getDataApi(e).message)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [accountId])
  return (
    <Row gutter={40}>
      <Col lg={8} md={12} sm={24}>
        <PieChartCustom nameChart={"Thanh toán"} data={pie1} />
      </Col>
      <Col lg={8} md={12} sm={24}>
        <PieChartCustom
          nameChart={"Số tiền thanh toán"}
          data={pie2}
          convert={(value) => {
            return formatCurrency(value) + " đ";
          }}
        />
      </Col>
      <Col lg={8} md={12} sm={24}>
        <PieChartCustom nameChart={"Phương thức thanh toán"} data={pie3} />
      </Col>
    </Row>
  );
};

export default TkTicketPayment;
