import { useParams } from "react-router-dom";
import InfoBox from "./InfoBox";
import PermissionBox from "./PermissionBox/PermissionBox";
import StatisticalReport from "./StatisticalReport";

const PartnerInfo = () => {
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
        <span style={{ fontSize: 16, fontWeight: "bold" }}>Đối tác A</span>
        <span> - {id}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", paddingTop: 16 }}>
        {/* <Avatar linkImage={null} /> */}
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

export default PartnerInfo;
