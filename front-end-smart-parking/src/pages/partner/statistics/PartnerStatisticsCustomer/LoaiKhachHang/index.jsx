import PieChartCustom from "@/components/chart/PieChartCustom";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const LoaiKhachHang = ({month, year}) => {
 const partnerId = getAccountId();
  const query = `WITH customer_first_order AS (
    SELECT
        op.payment_by AS customer_id,
        MIN(op.created_at) AS first_order_date
    FROM
        order_parking op
            INNER JOIN location l ON op.location_id = l.location_id
    WHERE
        l.partner_id = '${partnerId}'
      AND op.status = 2
    GROUP BY
        op.payment_by
),
     customers_up_to_month AS (
         SELECT DISTINCT
             cfo.customer_id,
             cfo.first_order_date
         FROM
             customer_first_order cfo
         WHERE
             (YEAR(cfo.first_order_date) < ${year})
            OR (YEAR(cfo.first_order_date) = ${year} AND MONTH(cfo.first_order_date) <= ${month})
     )
SELECT
    'Khách hàng mới' AS customer_type,
    COUNT(DISTINCT cutm.customer_id) AS customer_count
FROM
    customers_up_to_month cutm
WHERE
    YEAR(cutm.first_order_date) = ${year}
  AND MONTH(cutm.first_order_date) = ${month}

UNION ALL

SELECT
    'Luỹ kế tháng trước' AS customer_type,
    COUNT(DISTINCT cutm.customer_id) AS customer_count
FROM
    customers_up_to_month cutm
WHERE
    (YEAR(cutm.first_order_date) < ${year})
   OR (YEAR(cutm.first_order_date) = ${year} AND MONTH(cutm.first_order_date) < ${month});
`
  const [data, setData] = useState();
  useEffect(() => {
    if (year === undefined || month === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = [];
      response.data?.forEach(item => {
        result.push({name: item.customer_type, value: item.customer_count})
      })
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);
  return (
    <div className='LoaiKhachHang'>
      <PieChartCustom nameChart={`Khách hàng mới/cũ - tháng ${month}/${year}`} height={400} data={data}/>
    </div>
  );
};

export default LoaiKhachHang;