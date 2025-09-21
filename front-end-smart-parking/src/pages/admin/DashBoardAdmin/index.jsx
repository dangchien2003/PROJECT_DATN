import DashboardCard from "./DashboardCard";
import DividerCustom from "@/components/DividerCustom";
import DashboardChart from "./DashboardChart";
import { useEffect } from "react";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { MENU_ADMIN_ID } from "@/utils/constants";

const DashboardAdmin = () => {
  const { select } = useSelectMenu();
  useEffect(() => {
    select(MENU_ADMIN_ID.TRANG_CHU);
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

export default DashboardAdmin;
