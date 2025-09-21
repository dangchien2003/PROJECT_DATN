import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const Top10VeCoLuotMuaCaoNhat = ({ month, year }) => {
  const query = `SELECT
    t.name,
    COUNT(op.order_id) AS so_luong_order
FROM
    ticket t
        JOIN
    order_parking op ON t.ticket_id = op.ticket_id
WHERE
    op.status = 2
  AND YEAR(op.created_at) = ${year}
  AND MONTH(op.created_at) = ${month}
GROUP BY
    t.name
ORDER BY
    so_luong_order DESC
LIMIT 5;`
  const [data, setData] = useState();
  useEffect(() => {
    if (year === undefined || month === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push(item.name);
        result.values.push(item.so_luong_order);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);
  return (
    <div className='Top10VeCoLuotMuaCaoNhat'>
      <HorizontalBarChart nameChart={`Top 10 vé có lượt mua cao nhất - tháng ${month}/${year}`} data={data} nameX={"Số đơn"} height={400} />
    </div>
  );
};

export default Top10VeCoLuotMuaCaoNhat;