import { useParams } from "react-router-dom";
import InfoBox from "./InfoBox";
import StatisticalReport from "./StatisticalReport";
import Avatar from "@/components/Avatar";
import { useEffect, useState } from "react";
import { detailCustomer } from "@/service/accountService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";

const AccountCustomerInfo = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await detailCustomer({ id });
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
        <span style={{ fontSize: 16, fontWeight: "bold" }}>{data.fullName}</span>
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
          <InfoBox data={data}/>
          {/* Quyền của tài khoản */}
          {/* tạm thời không cần */}
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

export default AccountCustomerInfo;
