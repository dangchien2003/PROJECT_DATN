import DashboardCard from "./DashboardCard";
import DividerCustom from "@/components/DividerCustom";
import DashboardChart from "./DashboardChart";

const DashboardPartner = () => {
  return (
    <div>
      <DashboardCard />
      <DividerCustom style={{ width: "80%" }} />
      <div style={{ paddingTop: 50 }}>
        <DashboardChart />
      </div>
    </div>
  );
};

export default DashboardPartner;
