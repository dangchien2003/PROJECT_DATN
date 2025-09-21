import PieChartCustom from "@/components/chart/PieChartCustom";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const ThongKeTheoTrangThai = () => {
  const query = `WITH status_list AS (
    SELECT 0 AS status, 'Đã khóa' AS ten_trang_thai
    UNION ALL
    SELECT 1, 'Khóa tạm thời'
    UNION ALL
    SELECT 2, 'Đang hoạt động'
)
SELECT
    sl.ten_trang_thai,
    COALESCE(COUNT(a.id), 0) AS so_luong_ban_ghi
FROM
    status_list sl
        LEFT JOIN account a ON
        a.status = sl.status
            AND a.category = 1
GROUP BY
    sl.status,
    sl.ten_trang_thai
ORDER BY
    sl.status;
`
  const [data, setData] = useState();
  useEffect(() => {
    getDataStatistic(query).then(response => {
      const result = [];
      response.data?.forEach(element => {
        result.push({ name: element.ten_trang_thai, value: element.so_luong_ban_ghi })
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  return (
    <div className='ThongKeTheoTrangThai'>
      <PieChartCustom nameChart={"Thống kê theo trạng thái"} data={data} />
    </div>
  );
};

export default ThongKeTheoTrangThai;