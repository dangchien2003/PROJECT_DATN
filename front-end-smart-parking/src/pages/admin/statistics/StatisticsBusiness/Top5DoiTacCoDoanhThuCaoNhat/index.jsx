import HorizontalBarChart from '@/components/chart/HorizontalBarChart';
import './style.css'
import { useEffect, useState } from 'react';
import { getDataStatistic } from '@/service/statisticalService';

const Top5DoiTacCoDoanhThuCaoNhat = ({ month, year }) => {
  const query = `WITH partner_revenue AS (
    SELECT
        t.partner_id,
        a.partner_full_name,
        SUM(op.total) as total_revenue
    FROM
        order_parking op
            JOIN
        ticket t ON op.ticket_id = t.ticket_id
            JOIN
        account a ON t.partner_id = a.id
    WHERE
        YEAR(op.created_at) = ${year}
      AND MONTH(op.created_at) = ${month}
      AND op.status = 2
      AND a.category = 1
    GROUP BY
        t.partner_id,
        a.partner_full_name

    UNION ALL
    SELECT
        t.partner_id,
        a.partner_full_name,
        SUM(p.total) as total_revenue
    FROM
        payment p
            JOIN
        ticket t ON p.object_id = t.ticket_id
            JOIN
        account a ON t.partner_id = a.id
    WHERE
        YEAR(p.created_at) = ${year}
      AND MONTH(p.created_at) = ${month}
      AND p.type = 1
      AND p.status = 2
      AND a.category = 1
    GROUP BY
        t.partner_id,
        a.partner_full_name
)

SELECT
    partner_full_name,
    SUM(total_revenue) as totalRevenue
FROM
    partner_revenue
GROUP BY
    partner_id,
    partner_full_name
ORDER BY
    total_revenue DESC
LIMIT 5;
`
  const [data, setData] = useState();
  useEffect(() => {
    if (year === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push(item["partner_full_name"]);
        result.values.push(item.totalRevenue);
      });
      setData(result);
    });
  }, [year, month]);
  return (
    <div className='Top5DoiTacCoDoanhThuCaoNhat'>
      <HorizontalBarChart nameChart={`Top 5 đối tác có doanh thu cao nhất - tháng ${month}/${year}`} data={data} nameX={"Doanh thu"} />
    </div>
  );
};

export default Top5DoiTacCoDoanhThuCaoNhat;