import PieChartCustom from "@/components/chart/PieChartCustom";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const ChiTieuTrongThang = ({month, year}) => {
 const accountId = getAccountId();
  const query = `
WITH all_types AS (
    SELECT 'Mua vé' AS expense_type, 0 AS type_code
    UNION ALL
    SELECT 'Gia hạn vé', 1
    UNION ALL
    SELECT 'Nạp tiền', 2
),
     payment_summary AS (
         SELECT
             CASE type
                 WHEN 0 THEN 'Mua vé'
                 WHEN 1 THEN 'Gia hạn vé'
                 WHEN 2 THEN 'Nạp tiền'
                 END AS expense_type,
             SUM(total) AS total_amount
         FROM payment
         WHERE payment_by = '${accountId}'
           AND YEAR(created_at) = ${year}
           AND MONTH(created_at) = ${month}
           AND status = 2
         GROUP BY type
     )

SELECT
    at.expense_type,
    COALESCE(ps.total_amount, 0) AS total_amount
FROM
    all_types at
        LEFT JOIN
    payment_summary ps ON at.expense_type = ps.expense_type
ORDER BY
    total_amount DESC;

       `
  const [data, setData] = useState([]);
  useEffect(() => {
    if (month === null || year === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = []
      response.data?.forEach(item => {
        result.push({name: item.expense_type, value: item.total_amount})
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [month, year]);
  return (
    <div className='ChiTieuTrongThang'>
      <PieChartCustom nameChart={`Chi tiêu tháng - tháng ${month}/${year}`} data={data} />
    </div>
  );
};

export default ChiTieuTrongThang;