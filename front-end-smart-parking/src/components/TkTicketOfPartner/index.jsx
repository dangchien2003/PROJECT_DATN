import { getDataStatistic } from "@/service/statisticalService";
import PieChartCustom from "@Components/chart/PieChartCustom";
import { useEffect, useState } from "react";

const TkTicketOfPartner = ({ accountId }) => {
  const [pie1, setPie1] = useState([]);
  const [pie2, setPie2] = useState([]);
  const query1 = `
    with status as (
      select 0 as id, 'Chờ phát hành' as name
      union all
      select 1, 'Đang phát hành'
      union all
      select 2, 'Tạm dừng phát hành'
      union all
      select 3, 'Đã huỷ'
    )
    select s.name, count(t.ticket_id) as count from status s
    left join ticket t on t.status = s.id and t.partner_id = '${accountId}'
    group by s.id, s.name
    order by s.id
  `
  useEffect(() => {
    if(!accountId) {
      return;
    }
    getDataStatistic(query1).then(response => {
      const data = [];
      response.data.forEach(item => data.push({name: item.name, value: item.count}))
      setPie1(data);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [accountId])

  const query2 = `
    with vehicle as (
      select 0 as id, 'Ô tô' as name
      union all
      select 1, 'Xe máy'
      union all
      select 2, 'Hỗn hợp'
    )
    select s.name, count(t.ticket_id) as count from vehicle s
    left join ticket t on t.vehicle = s.id and t.partner_id = '${accountId}'
    group by s.id, s.name
    order by s.id
  `
  useEffect(() => {
    if(!accountId) {
      return;
    }
    getDataStatistic(query2).then(response => {
      const data = [];
      response.data.forEach(item => data.push({name: item.name, value: item.count}))
      setPie2(data);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [accountId])
  return (
    <div
      style={{
        borderLeft: "1px solid #B9B7B7",
        height: "inline",
        paddingLeft: 8,
        paddingTop: 8,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <PieChartCustom nameChart={"Vé theo trạng thái"} data={pie1} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <PieChartCustom nameChart={"Vé theo phương tiện"} data={pie2} />
      </div>
    </div>
  );
};

export default TkTicketOfPartner;
