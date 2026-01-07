import CardDashboard from "../CardDashboard";
import day from "@image/24-hours.png";
import week from "@image/7-days.png";
import month from "@image/30-days.png";
import { COLOR } from "@/utils/constants";
import { getDataStatistic } from "@/service/statisticalService";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/number";

const TkSaleTicketOfPartner = ({ partnerId }) => {
  const [data, setData] = useState([]);
  const query1 = `
  select coalesce(sum(quality_ticket), 0) as sum from order_parking o
  join location l on o.location_id = l.location_id and l.partner_id = '${partnerId}'
  where o.status = 2 and date(o.created_at) = current_date
  union all
  select coalesce(sum(quality_ticket), 0) from order_parking o
  join location l on o.location_id = l.location_id and l.partner_id = '${partnerId}'
  where o.status = 2 and date(o.created_at) between current_date - interval 1 week + interval 1 day and current_date
  union all
  select coalesce(sum(quality_ticket), 0) from order_parking o
  join location l on o.location_id = l.location_id and l.partner_id = '${partnerId}'
  where o.status = 2 and date(o.created_at) between current_date - interval 1 month + interval 1 day  and current_date
  `
  useEffect(() => {
    if(!partnerId) {
      return;
    }
    getDataStatistic(query1).then(response => {
      setData(response.data);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [partnerId])
  return (
    <div
      style={{
        borderLeft: "1px solid #B9B7B7",
        height: "inline",
        paddingLeft: 8,
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <CardDashboard
          label={"Đã bán trong ngày"}
          value={formatCurrency(data[0]?.sum) + " vé"}
          icon={<img src={day} style={{ width: 50 }} alt="ngàyg" />}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <CardDashboard
          label={"Đã bán trong tuần"}
          value={formatCurrency(data[1]?.sum) + " vé"}
          borderColor={COLOR._00c49f}
          icon={<img src={week} style={{ width: 50 }} alt="tuầng" />}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <CardDashboard
          label={"Đã bán trong tháng"}
          value={formatCurrency(data[2]?.sum) + " vé"}
          borderColor={COLOR._ff8042}
          icon={<img src={month} style={{ width: 50 }} alt="tháng" />}
        />
      </div>
    </div>
  );
};

export default TkSaleTicketOfPartner;
