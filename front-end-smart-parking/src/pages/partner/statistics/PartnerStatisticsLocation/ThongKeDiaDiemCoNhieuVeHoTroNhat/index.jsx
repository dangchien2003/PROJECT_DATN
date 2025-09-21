import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import { getAccountId } from "@/service/localStorageService";
import { getDataStatistic } from "@/service/statisticalService";
import React, { useEffect, useState } from "react";
const ThongKeDiaDiemCoNhieuVeHoTroNhat = () => {
  const partnerId = getAccountId();

  const query = `select l.name, count(tl.id) as count_ticket from ticket_location tl
join ticket t on tl.object_id = t.ticket_id and t.status = 1
join location l on tl.location_id = l.location_id and l.status = 1
where t.partner_id = '${partnerId}' 
and tl.is_del = 0 and type = 2
group by l.location_id, l.name
order by count_ticket desc limit 10
`
  const [data, setData] = useState();
  useEffect(() => {
    getDataStatistic(query).then(response => {
      const result = { categories: [], values: [] }
      response.data?.forEach(item => {
        result.categories.push(item.name);
        result.values.push(item.count_ticket);
      });
      setData(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  return <div>
    <HorizontalBarChart nameChart={`Top 10 địa điểm có nhiều vé hỗ trợ nhất`} nameX={"Số vé"} data={data} />
  </div>;
};

export default ThongKeDiaDiemCoNhieuVeHoTroNhat;