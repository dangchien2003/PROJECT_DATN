import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const Top10TaiKhoanCoMucTieuDungCaoNhat = ({ month, year }) => {
  const query = `
  SELECT
    a.id AS id,
    a.full_name AS ten_tai_khoan,
    SUM(p.total) AS muc_tieu_dung
FROM
    payment p
        INNER JOIN account a ON p.payment_by = a.id
WHERE
    a.category = 2
  AND p.type IN (0, 1)
  AND p.status = 2
  AND YEAR(p.created_at) = ${year}
  AND MONTH(p.created_at) = ${month}
GROUP BY
    a.id,
    a.full_name
ORDER BY
    muc_tieu_dung DESC
LIMIT 10;
`
  const [data, setData] = useState();
  useEffect(() => {
    if (year === undefined || month === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push(item["ten_tai_khoan"] !== null ? item["ten_tai_khoan"] : item["id"]);
        result.values.push(item.muc_tieu_dung);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);
  return (
    <div className='Top10TaiKhoanCoMucTieuDungCaoNhat'>
      <HorizontalBarChart nameChart={`Top 10 tài khoản có mức tiêu dùng cao nhất - tháng ${month}/${year}`} data={data} />
    </div>
  );
};

export default Top10TaiKhoanCoMucTieuDungCaoNhat;