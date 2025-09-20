import PieChartCustom from "@/components/chart/PieChartCustom";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const SoLuotThayDoiThongTin = ({month, year}) => {
 const partnerId = getAccountId();
   const query = `SELECT
    COUNT(CASE WHEN t.ticket_id IS NULL THEN 1 END) AS so_ve_moi,
    COUNT(CASE WHEN t.ticket_id IS NOT NULL THEN 1 END) AS so_ve_chinh_sua
FROM
    ticket_wait_release t
WHERE
    is_del = 0
  AND partner_id = '${partnerId}'
  AND YEAR(created_at) = ${year}
  AND MONTH(created_at) = ${month};`
   const [data, setData] = useState();
   useEffect(() => {
     if (year === undefined || month === undefined) {
       return;
     }
     getDataStatistic(query).then(response => {
       const result = [{ name: "Thêm mới", value: response.data?.[0].so_ve_moi }, { name: "Chỉnh sửa", value: response.data?.[0].so_ve_chinh_sua }]
       setData(result);
     });
     // eslint-disable-next-line react-hooks/exhaustive-deps 
   }, [year, month]);
  return (
    <div className='SoLuotThayDoiThongTin'>
      <PieChartCustom nameChart={`Số lượt thay đổi thông tin - tháng ${month}/${year}`} height={400} data={data}/>
    </div>
  );
};

export default SoLuotThayDoiThongTin;