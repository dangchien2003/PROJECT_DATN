import PieChartCustom from "@/components/chart/PieChartCustom";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const ThongKeSoDon = ({ month, year }) => {
  const query = `SELECT 
    SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as successful_orders,
    SUM(CASE WHEN status != 2 THEN 1 ELSE 0 END) as failed_orders
FROM 
    order_parking
WHERE 
    YEAR(created_at) = ${year} 
    AND MONTH(created_at) = ${month}
GROUP BY 
    YEAR(created_at), 
    MONTH(created_at);
  `
  const [data, setData] = useState();
  useEffect(() => {
    if (month === undefined || year === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = [
        { name: "Thành công", value: response.data[0]?.successful_orders },
        { name: "Thất bại", value: response.data[0]?.failed_orders },
      ]
      console.log(result)
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);
  return (
    <div className='ThongKeSoDon'>
      <PieChartCustom nameChart={`Tỉ lệ đơn thành công/thất bại - tháng ${month}/${year}`} height={500} data={data} />
    </div>
  );
};

export default ThongKeSoDon;