import BarChartCustom from '@/components/chart/BarChartCustom';
import './style.css'
import { useEffect, useState } from 'react';
import { getDataStatistic } from '@/service/statisticalService';
import { getAccountId } from '@/service/localStorageService';

const SoTienThuDuocTheoThang = ({ year }) => {
  const partnerId = getAccountId();
  const query = `
    WITH RECURSIVE months AS (
    SELECT 1 as month_num
    UNION ALL
    SELECT month_num + 1
    FROM months
    WHERE month_num < 12
),
               partner_revenue AS (
                   SELECT
                       MONTH(p.created_at) as revenue_month,
                       SUM(p.total) as parking_revenue
                   FROM
                       payment p
                           JOIN order_parking op on op.order_id = p.object_id 
                       join ticket t ON op.ticket_id = t.ticket_id
                   WHERE
                       t.partner_id = '${partnerId}'
                     AND YEAR(p.created_at) = ${year}
                     AND p.status = 2
                     and p.type = 0
                   GROUP BY
                       MONTH(p.created_at)

                   UNION ALL

                   SELECT
                       MONTH(p.created_at) as revenue_month,
                       SUM(p.total) as ticket_revenue
                   FROM
                       payment p
                          JOIN ticket_purchased tp ON p.object_id = tp.id
                         JOIN ticket t on tp.ticket_id = t.ticket_id
                   WHERE
                       t.partner_id = '${partnerId}'
                     AND YEAR(p.created_at) = ${year}
                     AND p.type = 1
                     AND p.status = 2
                   GROUP BY
                       MONTH(p.created_at)
               )

SELECT
    concat('T', m.month_num) as month_num,
    COALESCE(SUM(pr.parking_revenue), 0) as total_revenue
FROM
    months m
        LEFT JOIN partner_revenue pr ON m.month_num = pr.revenue_month
GROUP BY
    m.month_num
ORDER BY
    m.month_num;
  `
  const [data, setData] = useState();
  useEffect(() => {
    if (year === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push(item.month_num);
        result.values.push(item.total_revenue);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year]);
  return (
    <div className='SoTienThuDuocTheoThang'>
      <BarChartCustom nameChart={"Doanh thu năm " + year} nameX={"Tháng"} nameY={"Doanh thu"} data={data}/>
    </div>
  );
};

export default SoTienThuDuocTheoThang;