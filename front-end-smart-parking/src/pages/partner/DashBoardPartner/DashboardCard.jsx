import CardDashboard from '@/components/CardDashboard'
import DoubleCardDashboard from '@/components/DoubleCardDashboard'
import { getAccountId } from '@/service/localStorageService'
import { getDataStatistic } from '@/service/statisticalService'
import { formatCurrency } from '@/utils/number'
import deposit from '@image/deposit.png'
import doanhThu from '@image/doanh_thu.png'
import location from '@image/location.png'
import ticket from '@image/ticket.png'
import ticket2 from '@image/ticket2.png'
import { Space } from 'antd'
import { useEffect, useState } from 'react'

const DashboardCard = () => {
  const partnerId = getAccountId();
  const query = `
     with result as (SELECT COALESCE(SUM(p.total), 0) as ticket_revenue
                FROM payment p
                         join order_parking op on op.order_id = p.object_id
                         JOIN ticket t ON op.ticket_id = t.ticket_id and p.type = 0
                WHERE t.partner_id = '${partnerId}'
                  and p.type = 0
                  AND YEAR(p.created_at) = year(CURRENT_DATE)
                  AND month(p.created_at) = month(CURRENT_DATE)
                  AND p.status = 2
                UNION ALL
                SELECT COALESCE(SUM(p.total), 0) as ticket_revenue
                FROM payment p
                         JOIN ticket_purchased tp ON p.object_id = tp.id
                         JOIN ticket t on tp.ticket_id = t.ticket_id
                WHERE t.partner_id = '${partnerId}'
                  AND YEAR(p.created_at) = year(CURRENT_DATE)
                  AND month(p.created_at) = month(CURRENT_DATE)
                  AND p.type = 1
                  AND p.status = 2),
     result_prev_month as (SELECT COALESCE(SUM(p.total), 0) as ticket_revenue
                           FROM payment p
                         join order_parking op on op.order_id = p.object_id
                         JOIN ticket t ON op.ticket_id = t.ticket_id and p.type = 0
                WHERE t.partner_id = '${partnerId}'
                  and p.type = 0
  AND YEAR (p.created_at) = YEAR (DATE_SUB(CURRENT_DATE
    , INTERVAL 1 MONTH))
  AND MONTH (p.created_at) = MONTH (DATE_SUB(CURRENT_DATE
    , INTERVAL 1 MONTH))
  AND p.status = 2
UNION ALL
SELECT COALESCE(SUM(p.total), 0) as ticket_revenue
FROM payment p JOIN ticket_purchased tp
ON p.object_id = tp.id JOIN ticket t on tp.ticket_id = t.ticket_id
WHERE t.partner_id = '${partnerId}'
  AND YEAR (p.created_at) = YEAR (DATE_SUB(CURRENT_DATE
    , INTERVAL 1 MONTH))
  AND MONTH (p.created_at) = MONTH (DATE_SUB(CURRENT_DATE
    , INTERVAL 1 MONTH))
  AND p.type = 1
  AND p.status = 2)
    , resultKh as (
select distinct p.payment_by
from payment p
    left join order_parking op on op.status = 2 and op.order_id = p.object_id and p.type = 0
    left join ticket_purchased tp on tp.id = p.object_id and p.type = 1
    left join location l on l.location_id = op.location_id or l.location_id = tp.location_id
where p.status = 2 and l.partner_id = '${partnerId}'), ticket_count_prev_month as (
select count(*) as count_prev
from ticket_in_out tio join location l
on l.location_id = tio.location_id
where l.partner_id = '${partnerId}'
  AND YEAR (tio.created_at) = YEAR (DATE_SUB(CURRENT_DATE
    , INTERVAL 1 MONTH))
  AND MONTH (tio.created_at) = MONTH (DATE_SUB(CURRENT_DATE
    , INTERVAL 1 MONTH)))
select sum(r.ticket_revenue) as total, CASE WHEN sum(r.ticket_revenue) > (select sum(ticket_revenue) from result_prev_month) THEN 1 WHEN sum(r.ticket_revenue) < (select sum(ticket_revenue) from result_prev_month) THEN 2 ELSE 0 END as fluc
from result r
union all
select count(*) as total, CASE WHEN count(*) > (select count_prev from ticket_count_prev_month) THEN 1 WHEN count(*) < (select count_prev from ticket_count_prev_month) THEN 2 ELSE 0 END as fluc
from ticket_in_out tio join location l
on l.location_id = tio.location_id
where l.partner_id = '${partnerId}'
  AND YEAR (tio.created_at) = year (CURRENT_DATE)
  AND month (tio.created_at) = month (CURRENT_DATE)
union all
select count(*) as total, null as fluc
from resultKh

    `
  const [data, setData] = useState();
  const [data1, setData1] = useState();
  useEffect(() => {
    getDataStatistic(query).then(response => {
      setData(response.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const query1 = `
      with diemDo as (select case when l.status = 1 then 1 else 0 end as mark
                from location l
                where partner_id = '${partnerId}'),
     ve as (select case when t.status = 1 then 1 else 0 end as mark
            from ticket t
            where partner_id = '${partnerId}'),
     veBan as (select
                   case when tp.status = 0 and expires > CURRENT_TIMESTAMP then 1 else 0 end as mark
            from ticket_purchased tp
            join ticket t on t.ticket_id = tp.ticket_id
            where t.partner_id = '${partnerId}')
select sum(mark) as count,
       count(*)  as total
from diemDo
union all
select sum(mark) as count,
       count(*)  as total
from ve
union all
select sum(mark) as count,
       count(*)  as total
from veBan
    `
  useEffect(() => {
    getDataStatistic(query1).then(response => {
      setData1(response.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  return (
    <div style={{ padding: 36, paddingBottom: 50 }}>
      <Space style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Space direction='vertical' size="middle" >
          <CardDashboard label="Doanh thu (tháng)" value={formatCurrency(data?.[0]?.total) + " đ"} icon={(<img src={doanhThu} style={{ width: 40 }} alt="Doanh thu tháng" />)} borderColor='#f6a621' growth={data?.[0]?.fluc === 1 ? "up" : "down"} />
          <DoubleCardDashboard label="Điểm đỗ" value={{ title1: 'Đang lưu hành', value1: formatCurrency(data1?.[0]?.count) , title2: 'Tổng số', value2: formatCurrency(data1?.[0]?.total) }} icon={location} borderColor='#f6a621' />
        </Space>
        <Space direction='vertical' size="middle">
          <CardDashboard label="Lượt sử dụng (tháng)" value={formatCurrency(data?.[1]?.total)} icon={(<img src={deposit} style={{ width: 40 }} alt="Dòng tiền vào" />)} borderColor='#FF8042' growth={data?.[1]?.fluc === 1 ? "up" : "down"} />
          <DoubleCardDashboard label="Vé đã tạo" value={{ title1: 'Đang lưu hành', value1: formatCurrency(data1?.[1]?.count), title2: 'Tổng số', value2: formatCurrency(data1?.[1]?.total) }} icon={ticket} borderColor='#FF8042' />
        </Space>
        <Space direction='vertical' size="middle">
          <CardDashboard label="Khách hàng" value={formatCurrency(data?.[2]?.total)} icon={(<img src={ticket2} style={{ width: 40 }} alt="Vé đã bán" />)} borderColor='#00C49F' />
           <DoubleCardDashboard label="Vé đã bán" value={{ title1: 'Còn hiệu lực', value1: formatCurrency(data1?.[2]?.count), title2: 'Tổng số', value2: formatCurrency(data1?.[2]?.total) }} icon={ticket} borderColor='#00C49F' />
        </Space>
      </Space>
    </div>
  )
}

export default DashboardCard
