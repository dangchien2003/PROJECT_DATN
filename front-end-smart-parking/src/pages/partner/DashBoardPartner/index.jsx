import DashboardCard from "./DashboardCard";
import DividerCustom from "@/components/DividerCustom";
import DashboardChart from "./DashboardChart";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { useEffect } from "react";
import { MENU_PARTNER_ID } from "@/utils/constants";

const DashboardPartner = () => {
  const { select } = useSelectMenu();

  useEffect(() => {
    select(MENU_PARTNER_ID.TRANG_CHU);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
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
