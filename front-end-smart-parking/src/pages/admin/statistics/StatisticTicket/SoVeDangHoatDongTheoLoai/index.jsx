import PieChartCustom from "@/components/chart/PieChartCustom";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const SoVeDangHoatDongTheoLoai = () => {
  // const data = [{ name: "Vé giờ", value: 124 }, { name: "Vé ngày", value: 500 }, { name: "Vé tuần", value: 100 }, { name: "Vé tháng", value: 50 }]
  const query = `SELECT
    'Vé Khung Giờ' AS loai_ve,
    COUNT(*) AS so_luong_ve
FROM
    ticket
WHERE
    price_time_slot IS NOT NULL AND
    status = 1

UNION ALL

SELECT
    'Vé Ngày' AS loai_ve,
    COUNT(*) AS so_luong_ve
FROM
    ticket
WHERE
    price_day_slot IS NOT NULL AND
    status = 1

UNION ALL

SELECT
    'Vé Tuần' AS loai_ve,
    COUNT(*) AS so_luong_ve
FROM
    ticket
WHERE
    price_week_slot IS NOT NULL AND
    status = 1

UNION ALL

SELECT
    'Vé Tháng' AS loai_ve,
    COUNT(*) AS so_luong_ve
FROM
    ticket
WHERE
    price_month_slot IS NOT NULL AND
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
    <div className='SoVeDangHoatDongTheoLoai'>
      <PieChartCustom nameChart={`Số vé đang hoạt động theo loại`} data={data}/>
    </div>
  );
};

export default SoVeDangHoatDongTheoLoai;