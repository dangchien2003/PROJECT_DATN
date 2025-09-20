import PieChartCustom from "@/components/chart/PieChartCustom";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const SoLuotMuaTheoLoaiVe = ({month, year}) => {  
  const partnerId = getAccountId();
  const query = `WITH TicketTypes AS (
      SELECT 1 AS ticket_category, 'Vé Giờ' AS loai_ve
      UNION ALL
      SELECT 2, 'Vé Ngày'
      UNION ALL
      SELECT 3, 'Vé Tuần'
      UNION ALL
      SELECT 4, 'Vé Tháng'
  )
  
  SELECT 
      t.loai_ve,
      COALESCE(SUM(o.quality_ticket), 0) AS tong_so_luong_ve
  FROM 
      TicketTypes t
  LEFT JOIN 
      order_parking o ON t.ticket_category = o.ticket_category
      join ticket on ticket.ticket_id = o.ticket_id
      AND o.status = 2
      AND YEAR(o.created_at) = ${year}
      AND MONTH(o.created_at) = ${month}
      and ticket.partner_id = '${partnerId}'
  GROUP BY 
      t.ticket_category, 
      t.loai_ve
  ORDER BY 
      tong_so_luong_ve DESC;
  `
    const [data, setData] = useState();
    useEffect(() => {
      if (year === undefined || month === undefined) {
        return;
      }
      getDataStatistic(query).then(response => {
        const result = [];
        response.data?.forEach(item => {
          result.push({ name: item.loai_ve, value: item.tong_so_luong_ve });
        });
        setData(result);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [year, month]);
  return (
    <div className='SoLuotMuaTheoLoaiVe'>
      <PieChartCustom nameChart={`Số lượt mua theo loại vé - tháng ${month}/${year}`} height={400} data={data}/>
    </div>
  );
};

export default SoLuotMuaTheoLoaiVe;