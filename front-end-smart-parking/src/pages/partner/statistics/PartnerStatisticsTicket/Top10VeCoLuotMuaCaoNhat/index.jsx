import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import React, { useEffect, useState } from "react";
const Top10VeCoLuotMuaCaoNhat = ({month, year}) => {
  const partnerId = getAccountId();
    const query = `select t.name, count(op.order_id) as so_luot_mua  from order_parking op
join ticket t on t.ticket_id = op.ticket_id and t.status = 1
where t.partner_id = '${partnerId}'
and Year(op.created_at) = ${year} and month(op.created_at) = ${month}
group by op.ticket_id, t.name order by  so_luot_mua desc limit 10
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
          result.values.push(item.so_luot_mua);
        });
        setData(result);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [year, month]);
  return <div>
    <HorizontalBarChart nameChart={`Top 10 vé có lượt mua nhiều nhất - tháng ${month}/${year}`} nameX={"Số vé bán"} data={data} />
  </div>;
};

export default Top10VeCoLuotMuaCaoNhat;