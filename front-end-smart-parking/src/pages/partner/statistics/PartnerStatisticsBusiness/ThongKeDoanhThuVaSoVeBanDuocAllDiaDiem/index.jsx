import CombinedBarLineChart from '@/components/chart/CombinedBarLineChart';
import { getAccountId } from '@/service/localStorageService';
import { getDataStatistic } from '@/service/statisticalService';
import { useEffect, useRef, useState } from 'react';

const ThongKeDoanhThuVaSoVeBanDuocAllDiaDiem = ({ year, month }) => {
  const partnerId = getAccountId();
  const query = `
  WITH location_revenue AS (
SELECT l.location_id          AS location_id,
    l.name                 AS location_name,
    SUM(op.quality_ticket) AS so_ve_ban_duoc,
    SUM(op.total)          AS doanh_thu_mua_moi
FROM payment p
      JOIN order_parking op ON p.object_id = op.order_id and p.type = 0
      JOIN location l ON l.location_id = op.location_id
WHERE p.type = 0 AND p.status = 2
      And l.partner_id = '${partnerId}'
      AND YEAR(p.created_at) = ${year}
      AND MONTH(p.created_at) = ${month}
        GROUP BY l.location_id, l.name
),
    extend_revenue AS (
SELECT l.location_id, SUM(p.total) AS doanh_thu_gia_han
FROM payment p
    JOIN ticket_purchased tp ON p.object_id = tp.id
    join location l on tp.location_id = l.location_id
WHERE p.type = 1
  AND p.status = 2
            And l.partner_id = '${partnerId}'
           AND YEAR(p.created_at) = ${year}
           AND MONTH(p.created_at) = ${month}
        GROUP BY l.location_id )
SELECT lr.location_name,
       lr.so_ve_ban_duoc,
       COALESCE(lr.doanh_thu_mua_moi, 0) + COALESCE(er.doanh_thu_gia_han, 0) AS tong_doanh_thu
FROM location_revenue lr
         LEFT JOIN extend_revenue er
                   ON lr.location_id = er.location_id
ORDER BY lr.location_name ASC
  `
  const [data, setData] = useState();
  useEffect(() => {
    if (month === undefined || year === undefined) {
      return;
    }
    getDataStatistic(query).then(response => {
      const result = { categories: [], barData: [], lineData: [] };
      response.data?.forEach(item => {
        result.categories.push(item.location_name);
        result.barData.push(item.so_ve_ban_duoc);
        result.lineData.push(item.tong_doanh_thu);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);
  const description = useRef({
    nameBar: "Số vé bán",
    nameLine: "Doanh thu"
  })
  return (
    <div className='ThongKeDoanhThuVaSoVeBanDuocAllDiaDiem'>
      <CombinedBarLineChart chartName={`Số vé bán và doanh thu - tháng ${month}/${year}`} data={data} description={description.current} height={500}/>
    </div>
  );
};

export default ThongKeDoanhThuVaSoVeBanDuocAllDiaDiem;