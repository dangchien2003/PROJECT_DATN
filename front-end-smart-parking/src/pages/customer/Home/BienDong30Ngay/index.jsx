import AreaChartCustom from '@/components/AreaChartCustom';
import { getAccountId } from '@/service/localStorageService';
import { getDataStatistic } from '@/service/statisticalService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const BienDong30Ngay = () => {
  const [data, setData] = useState({x: [], y: []});
  const accountId = getAccountId();
  const currentBalance = useSelector(state => state.remaining)
  const query = `WITH RECURSIVE date_series AS (
    SELECT CURRENT_DATE AS calculation_date, 0 AS day_offset
    UNION ALL
    SELECT
        DATE_SUB(CURRENT_DATE, INTERVAL day_offset + 1 DAY),
        day_offset + 1
    FROM date_series
    WHERE day_offset < 29
),
               daily_transactions AS (
                   SELECT
                       DATE(p.created_at) AS transaction_date,
                       SUM(CASE
                               WHEN p.fluctuation = 1 THEN p.total 
                               WHEN p.fluctuation = 2 THEN -p.total   
                               ELSE 0
                           END) AS net_amount
                   FROM
                       Payment p
                   WHERE
                       p.payment_by = '${accountId}'
                     AND p.status = 2
                     AND p.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
                     AND p.created_at < DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)
                   GROUP BY
                       DATE(p.created_at)
               ),
               balance_calculation AS (
                   SELECT
                       ds.calculation_date,
                       COALESCE(dt.net_amount, 0) AS daily_net_change,
                       (
                           SELECT COALESCE(SUM(dt2.net_amount), 0)
                           FROM daily_transactions dt2
                           WHERE dt2.transaction_date > ds.calculation_date
                       ) AS total_changes_after_this_date
                   FROM
                       date_series ds
                           LEFT JOIN
                       daily_transactions dt ON ds.calculation_date = dt.transaction_date
               )
SELECT
    date_format(calculation_date, '%d/%m/%Y') as calculation_date_format,
    (${currentBalance} - total_changes_after_this_date) AS end_of_day_balance
FROM
    balance_calculation
ORDER BY
    calculation_date asc;
 `
  useEffect(() => {
    getDataStatistic(query).then(response => {
      const result = {x: [], y: []}
      response.data?.forEach(item => {
        result.x.push(item.calculation_date_format);
        result.y.push(item.end_of_day_balance);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div className='BienDong30Ngay'>
      <AreaChartCustom
        data={data}
        nameChart={"Biến động 30 ngày gần nhất"}
        height={500}
      />
    </div>
  );
};

export default BienDong30Ngay;