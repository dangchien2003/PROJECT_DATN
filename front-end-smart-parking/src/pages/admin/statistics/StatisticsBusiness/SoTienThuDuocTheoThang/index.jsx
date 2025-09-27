import BarChartCustom from '@/components/chart/BarChartCustom';
import './style.css'
import { useEffect, useState } from 'react';
import { getDataStatistic } from '@/service/statisticalService';

const SoTienThuDuocTheoThang = ({ year }) => {
  const query = `WITH RECURSIVE months(month) AS (
    SELECT 1
    UNION ALL
    SELECT month + 1 
    FROM months 
    WHERE month < 12
),
payment_revenue AS (
    SELECT 
        MONTH(created_at) AS month,
        SUM(total) AS monthly_revenue
    FROM 
        payment
    WHERE 
        YEAR(created_at) = ${year} 
        AND type IN (0, 1)
        AND status = 2
    GROUP BY 
        MONTH(created_at)
)

SELECT 
    months.month,
    COALESCE(payment_revenue.monthly_revenue, 0) AS monthlyRevenue
FROM 
    months
LEFT JOIN 
    payment_revenue ON months.month = payment_revenue.month
ORDER BY 
    months.month;`
  const [data, setData] = useState();
  useEffect(() => {
    if (year === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push("T" + item.month);
        result.values.push(item.monthlyRevenue);
      });
      setData(result);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year]);
  return (
    <div className='SoTienThuDuocTheoThang'>
      <BarChartCustom nameChart={"Doanh thu năm " + year} nameX={"Tháng"} nameY={"Doanh thu"} data={data} />
    </div>
  );
};

export default SoTienThuDuocTheoThang;