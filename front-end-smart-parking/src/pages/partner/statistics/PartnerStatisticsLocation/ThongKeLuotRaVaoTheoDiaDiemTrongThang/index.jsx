import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import React, { useEffect, useState } from "react";
const ThongKeLuotRaVaoTheoDiaDiemTrongThang = ({ month, year }) => {
  const partnerId = getAccountId();
  const query = `select l.name, count(tio.id) as so_luot from ticket_in_out tio
join location l on tio.location_id = l.location_id and l.status = 1
where l.partner_id = '${partnerId}'
and MONTH(tio.created_at) = ${month} and YEAR(tio.created_at) = ${year}
group by l.location_id, l.name order by so_luot desc limit 10
 `
  const [data, setData] = useState();
  useEffect(() => {
    getDataStatistic(query).then(response => {
      if (year === undefined || month === undefined) {
        return;
      }
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push(item.name);
        result.values.push(item.so_luot);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);
  return <div>
    <HorizontalBarChart nameChart={`Top 10 địa điểm có lượt ra vào nhiều nhất - tháng ${month}/${year}`} nameX={"Số lượt ra vào"} data={data} />
  </div>;
};

export default ThongKeLuotRaVaoTheoDiaDiemTrongThang;