import { useParams } from "react-router-dom";
import InfoBox from "./InfoBox";
import StatisticalReport from "./StatisticalReport";
import { useEffect, useState } from "react";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { detailPartner } from "@/service/accountService";
import PermissionBox from "./PermissionBox/PermissionBox";
import "./style.css"
const PartnerInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await detailPartner({ id });
          if (response) {
            setData(getDataApi(response));
          }
        } catch (error) {
          const result = getDataApi(error);
          toastError(result.message);  
        } finally {
          
        }
      };
      fetchData();
    }, [id])
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
        <span style={{ fontSize: 16, fontWeight: "bold" }}>{data.partnerFullName}</span>
        <span> - {data.id}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", paddingTop: 16 }}>
        {/* <Avatar linkImage={null} /> */}
        <div style={{ paddingLeft: 16, display: "flex", flexWrap: "wrap" }}>
          {/* Thông tin tài khoản */}
          <InfoBox data={data}/>
          {/* Quyền của tài khoản */}
          {/* <PermissionBox /> */}
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
