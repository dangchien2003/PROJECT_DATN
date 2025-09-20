import PieChartCustom from "@/components/chart/PieChartCustom";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const ThongKeTheoTrangThai = () => {
  const query = `WITH status_list AS (
    SELECT 0 AS status, 'Chờ duyệt' AS ten_trang_thai
    UNION ALL
    SELECT 1, 'Chờ cấp'
    UNION ALL
    SELECT 2, 'Chờ kích hoạt'
    UNION ALL 
    SELECT 3, 'Đang hoạt động'
    UNION ALL
    SELECT 4, 'Tạm khóa'
    UNION ALL
    SELECT 5, 'Khóa vĩnh viễn'
    UNION ALL
    SELECT 6, 'Từ chối'
)
SELECT
    sl.ten_trang_thai,
    COALESCE(COUNT(c.id), 0) AS so_luong_ban_ghi
FROM
    status_list sl
        LEFT JOIN card c ON
        c.status = sl.status
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
      <PieChartCustom nameChart={"Thống kê thẻ theo trạng thái"} data={data}/>
    </div>
  );
};

export default ThongKeTheoTrangThai;