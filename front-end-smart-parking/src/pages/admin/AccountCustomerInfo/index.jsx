import { useParams } from "react-router-dom";
import InfoBox from "./InfoBox";
import PermissionBox from "./PermissionBox/PermissionBox";
import StatisticalReport from "./StatisticalReport";
import Avatar from "@/components/Avatar";

const AccountCustomerInfo = () => {
  const { id } = useParams();
  // const dataCustomer = {}
  return (
    <div>
      {/* định danh tài khoản */}
      <div
        style={{
          paddingBottom: 8,
          borderBottom: "1px solid #B9B7B7",
          display: "inline-block",
          minWidth: 350,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: "bold" }}>Lê Đăng Chiến</span>
        <span> - {id}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", paddingTop: 16 }}>
        <Avatar
          linkImage={
            "https://cdn.tuoitre.vn/zoom/700_438/471584752817336320/2024/5/30/son-tung-m-tp-17170442465211639398190-232-0-1482-2000-crop-1717044577672815546045.jpg"
          }
        />
        <div style={{ paddingLeft: 16, display: "flex", flexWrap: "wrap" }}>
          {/* Thông tin tài khoản */}
          <InfoBox />
          {/* Quyền của tài khoản */}
          <PermissionBox />
        </div>
      </div>
      {/* báo cáo - thống kê */}
      <div>
        <StatisticalReport />
      </div>
    </div>
  );
};

export default AccountCustomerInfo;
