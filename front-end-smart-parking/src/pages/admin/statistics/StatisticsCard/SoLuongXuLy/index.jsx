import PieChartCustom from "@/components/chart/PieChartCustom";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const SoLuongXuLy = ({ month, year }) => {
  const query = `WITH status_list AS (
    SELECT 0 AS status
    UNION ALL
    SELECT 1
    UNION ALL
    SELECT 6
)
SELECT
    CASE sl.status
        WHEN 0 THEN 'Chờ duyệt'
        WHEN 1 THEN 'Chờ cấp'
        WHEN 6 THEN 'Từ chối'
        END AS ten_trang_thai,
    COALESCE(COUNT(c.id), 0) AS so_luong_ban_ghi
FROM
    status_list sl
        LEFT JOIN card c ON
        c.status = sl.status
            AND YEAR(c.created_at) = ${year}
            AND MONTH(c.created_at) = ${month}
GROUP BY
    sl.status,
    CASE sl.status
        WHEN 0 THEN 'Chờ duyệt'
        WHEN 1 THEN 'Chờ cấp'
        WHEN 6 THEN 'Từ chối'
        END
ORDER BY
    sl.status;

`
  const [data, setData] = useState();
  useEffect(() => {
    if (year === undefined || month === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = [];
      response.data?.forEach(element => {
        result.push({ name: element.ten_trang_thai, value: element.so_luong_ban_ghi })
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);
  return (
    <div className='SoLuongXuLy'>
      <PieChartCustom nameChart={`Yêu cầu xử lý - tháng ${month}/${year}`} data={data} />
    </div>
  );
};

export default SoLuongXuLy;