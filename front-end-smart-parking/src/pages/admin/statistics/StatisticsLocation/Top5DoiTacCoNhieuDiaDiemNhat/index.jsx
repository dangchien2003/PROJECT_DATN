import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const Top5DoiTacCoNhieuDiaDiemNhat = () => {
  const query = `SELECT
    p.partner_full_name,
    COUNT(l.location_id) AS so_luong_dia_diem
FROM
    account p
        LEFT JOIN
    location l ON p.id = l.partner_id
where p.category = 1
GROUP BY
    p.id,
    p.partner_full_name
ORDER BY
    so_luong_dia_diem DESC
LIMIT 5;`
  const [data, setData] = useState();
  useEffect(() => {
    getDataStatistic(query).then(response => {
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push(item.partner_full_name);
        result.values.push(item.so_luong_dia_diem);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  return (
    <div className='Top5DoiTacCoNhieuDiaDiemNhat'>
      <HorizontalBarChart nameChart={`Top 5 đối tác có nhiều địa điểm nhất`} nameX={"Số địa điểm"} data={data} />
    </div>
  );
};

export default Top5DoiTacCoNhieuDiaDiemNhat;