import CombinedBarLineChart from "@/components/chart/CombinedBarLineChart";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const ThongKeDiaDiemVoiVeBanVaDoanhThu = ({ month, year }) => {
  const query = `
  WITH partner_revenue AS (
    SELECT
        a.id AS partner_id,
        a.partner_full_name AS ten_doi_tac,
        SUM(op.quality_ticket) AS so_ve_ban_duoc,
        SUM(op.total) AS doanh_thu_mua_moi
    FROM
        account a
            JOIN
        ticket t ON t.partner_id = a.id
            JOIN
        order_parking op ON t.ticket_id = op.ticket_id
    WHERE
        a.category = 1
      AND op.status = 2
      AND YEAR(op.created_at) = ${year}
      AND MONTH(op.created_at) = ${month}
    GROUP BY
        a.id, a.partner_full_name
),
     extend_revenue AS (
         SELECT
             t.partner_id,
             SUM(p.total) AS doanh_thu_gia_han
         FROM
             payment p
                 JOIN
             ticket_purchased tp ON p.object_id = tp.id
                 JOIN
             ticket t ON tp.ticket_id = t.ticket_id
         WHERE
             p.type = 1
           AND p.status = 2
           AND YEAR(p.created_at) = ${year}
           AND MONTH(p.created_at) = ${month}
         GROUP BY
             t.partner_id
     )
SELECT
    pr.ten_doi_tac,
    pr.so_ve_ban_duoc,
    COALESCE(pr.doanh_thu_mua_moi, 0) + COALESCE(er.doanh_thu_gia_han, 0) AS tong_doanh_thu
FROM
    partner_revenue pr
        LEFT JOIN
    extend_revenue er ON pr.partner_id = er.partner_id
ORDER BY
    ten_doi_tac ASC
  `
  const [data, setData] = useState();
  useEffect(() => {
    if (month === undefined || year === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      console.log()
      const result = { categories: [], barData: [], lineData: [] };
      response.data?.forEach(item => {
        result.categories.push(item.ten_doi_tac);
        result.barData.push(item.so_ve_ban_duoc);
        result.lineData.push(item.tong_doanh_thu);
      });
      setData(result);
    });
  }, [year, month]);
  const description = {
    nameBar: "Số vé bán",
    nameLine: "Doanh thu"
  }
  console.log(data);
  console.log(description)
  return (
    <div className='ThongKeDiaDiemVoiVeBanVaDoanhThu'>
      <CombinedBarLineChart height={500} year={year} month={month} data={data}
        description={description} chartName={`Thống kê địa điểm với số vé bán và doanh thu - tháng ${month}/${year}`} />
    </div>
  );
};

export default ThongKeDiaDiemVoiVeBanVaDoanhThu;