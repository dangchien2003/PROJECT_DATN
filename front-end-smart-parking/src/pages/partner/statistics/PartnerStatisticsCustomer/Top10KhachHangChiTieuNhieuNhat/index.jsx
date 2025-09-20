import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import React, { useEffect, useState } from "react";
const Top10KhachHangChiTieuNhieuNhat = ({month, year}) => {
  const partnerId = getAccountId();
      const query = `SELECT
    a.full_name AS customer_name,
    a.id AS id,
    SUM(op.total) AS total_spending
FROM
    order_parking op
        Left JOIN location l ON op.location_id = l.location_id
        Left JOIN account a ON op.payment_by = a.id AND a.category = 2
WHERE
    l.partner_id = '${partnerId}'
  AND op.status = 2
  AND YEAR(op.created_at) = ${year}
  AND MONTH(op.created_at) = ${month}
GROUP BY
    a.id, a.full_name
ORDER BY
    total_spending DESC
LIMIT 10;
      `
      const [data, setData] = useState();
      useEffect(() => {
        if (year === undefined || month === undefined) {
          return;
        }
        getDataStatistic(query).then(response => {
          console.log(response)
          const result = { categories: [], values: [] }
          response.data?.forEach(item => {
            result.categories.push(item.customer_name != null ? item.customer_name : item.id);
            result.values.push(item.total_spending);
          });
          setData(result);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps 
      }, [year, month]);
  return <div>
    <HorizontalBarChart nameChart={`Top 10 khách hàng có chi tiêu nhiều nhất - tháng ${month}/${year}`} nameX={"Mức chi tiêu"} data={data} />
  </div>;
};

export default Top10KhachHangChiTieuNhieuNhat;