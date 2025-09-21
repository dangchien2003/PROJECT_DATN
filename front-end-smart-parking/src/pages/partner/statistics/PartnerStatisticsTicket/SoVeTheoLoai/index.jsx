import PieChartCustom from "@/components/chart/PieChartCustom";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const SoVeTheoLoai = () => {
  const partnerId = getAccountId();
   const query = `SELECT
      'Vé Khung Giờ' AS loai_ve,
      COUNT(*) AS so_luong_ve
  FROM
      ticket
  WHERE
     partner_id = '${partnerId}'
      and
      price_time_slot IS NOT NULL AND
      status = 1
  
  UNION ALL
  
  SELECT
      'Vé Ngày' AS loai_ve,
      COUNT(*) AS so_luong_ve
  FROM
      ticket
  WHERE
     partner_id = '${partnerId}'
      and
      price_day_slot IS NOT NULL AND
      status = 1
  
  UNION ALL
  
  SELECT
      'Vé Tuần' AS loai_ve,
      COUNT(*) AS so_luong_ve
  FROM
      ticket
  WHERE
     partner_id = '${partnerId}'
      and
      price_week_slot IS NOT NULL AND
      status = 1
  
  UNION ALL
  
  SELECT
      'Vé Tháng' AS loai_ve,
      COUNT(*) AS so_luong_ve
  FROM
      ticket
  WHERE
     partner_id = '${partnerId}'
      and price_month_slot IS NOT NULL AND
      status = 1
  `
      const [data, setData] = useState();
      useEffect(() => {
        getDataStatistic(query).then(response => {
          const result = [];
          response.data?.forEach(item => {
            result.push({name: item.loai_ve, value: item.so_luong_ve});
          });
          setData(result);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps 
      }, []);
  return (
    <div className='SoVeTheoLoai'>
      <PieChartCustom nameChart={"Số vé theo loại"} height={400} data={data}/>
    </div>
  );
};

export default SoVeTheoLoai;