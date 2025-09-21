import HorizontalBarChart from '@/components/chart/HorizontalBarChart';
import './style.css'
import { getAccountId } from '@/service/localStorageService';
import { useEffect, useState } from 'react';
import { getDataStatistic } from '@/service/statisticalService';

const Top5DiaDiemCoDoanhThuCaoNhat = ({year, month}) => {
   const partnerId = getAccountId();
    const query = `WITH location_revenue AS (
    SELECT
        l.location_id,
        l.name AS location_name,
        SUM(op.total) AS total_parking_revenue
    FROM
        order_parking op
            JOIN
        ticket t ON op.ticket_id = t.ticket_id
            JOIN
        location l ON op.location_id = l.location_id
    WHERE
        t.partner_id = '${partnerId}'
      AND YEAR(op.created_at) = ${year}
      AND MONTH(op.created_at) = ${month}
      AND op.status = 2
    GROUP BY
        l.location_id,
        l.name

    UNION ALL

    SELECT
        l.location_id,
        l.name AS location_name,
        SUM(p.total) AS total_ticket_revenue
    FROM
        payment p
            JOIN
        ticket t ON p.object_id = t.ticket_id
            JOIN
        location l ON t.ticket_id = l.location_id
    WHERE
        t.partner_id = '${partnerId}'
      AND YEAR(p.created_at) = ${year}
      AND MONTH(p.created_at) = ${month}
      AND p.type = 1
      AND p.status = 2
    GROUP BY
        l.location_id,
        l.name
)

SELECT
    location_name,
    ROUND(SUM(total_parking_revenue), 0) AS total_revenue
FROM
    location_revenue
GROUP BY
    location_id,
    location_name
ORDER BY
    total_revenue DESC
LIMIT 5;
    `
    const [data, setData] = useState();
    useEffect(() => {
      if (year === undefined || month === undefined) {
        return;
      }
      getDataStatistic(query).then(response => {
        const result = { categories: [], values: [] }
        response.data?.forEach(item => {
          result.categories.push(item.location_name);
          result.values.push(item.total_revenue);
        });
        setData(result);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [year, month]);
  return (
    <div className='Top5DiaDiemCoDoanhThuCaoNhat'>
      <HorizontalBarChart nameChart={`Top 5 địa điểm có doanh thu cao nhất - tháng ${month}/${year}`} data={data} nameX={"Doanh thu"}/>
    </div>
  );
};

export default Top5DiaDiemCoDoanhThuCaoNhat;
