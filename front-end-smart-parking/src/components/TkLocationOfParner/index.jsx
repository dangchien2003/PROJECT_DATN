import { getDataStatistic } from "@/service/statisticalService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import PieChartCustom from "@Components/chart/PieChartCustom";
import { useEffect, useState } from "react";

const TkLocationOfParner = ({ accountId }) => {
  const [pie, setPie] = useState([])
   const query1 = `
      with status as (
      select 0 as id, 'Chờ duyệt' as name
      union all
      select 1, 'Đang hoạt động'
      union all
      select 3, 'Tạm dừng hoạt động'
      union all
      select 4, 'Dừng hoạt động'
  )
  select s.name, count(l.location_id) as count
  from status s
           left join location l
                     on s.id = l.status
                         and l.partner_id = '${accountId}'
  group by s.name
  order by s.id;
    `
    useEffect(() => {
      if (!accountId) {
        return;
      }
      getDataStatistic(query1).then(response => {
        const data = [];
        response.data.forEach(item => data.push({ name: item.name, value: item.count }));
        setPie(data);
      }).catch(e => {
        toastError(getDataApi(e).message)
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [accountId])
  return (
    <div
      style={{
        borderLeft: "1px solid #B9B7B7",
        height: "inline",
        paddingLeft: 8,
        paddingTop: 8,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <PieChartCustom nameChart={"Địa điểm theo trạng thái"} data={pie} />
      </div>
    </div>
  );
};

export default TkLocationOfParner;
