import PieChartCustom from "@/components/chart/PieChartCustom";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";

const SoLuotChinhSua = ({month, year}) => {
  const query = `SELECT
    COUNT(CASE WHEN ticket_id IS NULL THEN 1 END) AS so_ve_moi,
    COUNT(CASE WHEN ticket_id IS NOT NULL THEN 1 END) AS so_ve_chinh_sua
FROM
    ticket_wait_release
WHERE
    is_del = 0
  AND YEAR(time_applied_edit) = ${year}
  AND MONTH(time_applied_edit) = ${month};`
      const [data, setData] = useState();
      useEffect(() => {
        if (year === undefined || month === undefined) {
          return;
        }
        getDataStatistic(query).then(response => {
          const result =   [{name: "Thêm mới", value: response.data?.[0].so_ve_moi}, {name: "Chỉnh sửa", value: response.data?.[0].so_ve_chinh_sua}]
          setData(result);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps 
      }, [year, month]);
  return (
    <div className='SoVeChinhSua'>
      <PieChartCustom nameChart={`Lượng lượt điều chỉnh - tháng ${month}/${year}`} data={data} height={400}/>
    </div>
  );
};

export default SoLuotChinhSua;