import PieChartCustom from "@/components/chart/PieChartCustom";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const TiLeDonMuaTrongThang = ({ month, year }) => {
  const accountId = getAccountId();
  const query = `
  SELECT 'Mua hộ' AS order_type, COALESCE(COUNT(*), 0) AS order_count
FROM order_parking
WHERE payment_by = '${accountId}'
  AND YEAR(created_at) = ${year}
  AND MONTH(created_at) = ${month}
  AND status = 2
  AND owners IS NOT NULL

UNION ALL

SELECT 'Mua cho bản thân' AS order_type, COALESCE(COUNT(*), 0) AS order_count
FROM order_parking
WHERE payment_by = '${accountId}'
  AND YEAR(created_at) = ${year}
  AND MONTH(created_at) = ${month}
  AND status = 2
  AND owners IS NULL;
       `
  const [data, setData] = useState([]);
  useEffect(() => {
    if (month === null || year === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = []
      response.data?.forEach(item => {
        result.push({name: item.order_type, value: item.order_count})
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [month, year]);
  return (
    <div className='TiLeDonMuaTrongThang'>
      <PieChartCustom nameChart={`Đơn mua - tháng ${month}/${year}`} data={data} />
    </div>
  );
};

export default TiLeDonMuaTrongThang;