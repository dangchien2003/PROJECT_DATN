import PieChartCustom from "@/components/chart/PieChartCustom";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const ThongKeDiaDiemTheoTrangThai = () => {
  const query = `WITH status_list(status, status_name) AS (
    VALUES
        (0, 'Chờ duyệt'),
        (1, 'Đã duyệt/Đang hoạt động'),
        (3, 'Tạm dừng hoạt động'),
        (4, 'Không hoạt động'),
        (5, 'Từ chối')
)
SELECT
    sl.status_name,
    COALESCE(COUNT(l.location_id), 0) AS so_luong_dia_diem
FROM
    status_list sl
        LEFT JOIN
    location l ON sl.status = l.status
GROUP BY
    sl.status,
    sl.status_name
ORDER BY
    sl.status;
`
          const [data, setData] = useState();
          useEffect(() => {
            getDataStatistic(query).then(response => {
              const result = [];
              response.data?.forEach(element => {
                result.push({name: element.status_name, value: element.so_luong_dia_diem})
              });
              setData(result);
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps 
          }, []);
  return (
    <div className='ThongKeDiaDiemTheoTrangThai'>
      <PieChartCustom nameChart={`Số địa điểm theo trạng thái`} height={400} data={data} />
    </div>
  );
};

export default ThongKeDiaDiemTheoTrangThai;