import CardDashboard from "../CardDashboard";
import day from "@image/24-hours.png";
import week from "@image/7-days.png";
import month from "@image/30-days.png";
import { COLOR } from "@/utils/constants";

const TkSaleTicketOfPartner = ({ info }) => {
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
          value="100 vé"
          icon={<img src={day} style={{ width: 50 }} alt="ngàyg" />}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <CardDashboard
          label={"Đã bán trong tuần"}
          value="150 vé"
          borderColor={COLOR._00c49f}
          icon={<img src={week} style={{ width: 50 }} alt="tuầng" />}
        />
      </div>
      <div style={{ marginBottom: 24 }}>
        <CardDashboard
          label={"Đã bán trong tháng"}
          value="500 vé"
          borderColor={COLOR._ff8042}
          icon={<img src={month} style={{ width: 50 }} alt="tháng" />}
        />
      </div>
    </div>
  );
};

export default TkSaleTicketOfPartner;
