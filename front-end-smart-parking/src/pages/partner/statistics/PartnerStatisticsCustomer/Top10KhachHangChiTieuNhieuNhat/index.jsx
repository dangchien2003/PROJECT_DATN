import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import React from "react";
const Top10KhachHangChiTieuNhieuNhat = ({month, year}) => {
  const data = {
    categories: ["Vé A", "Vé B", "Vé C", "Vé D"],
    values: [10, 11, 100, 10, 11, 100, 10, 11, 100]
  }
  return <div>
    <HorizontalBarChart nameChart={`Top 10 khách hàng có chi tiêu nhiều nhất - tháng ${month}/${year}`} nameX={"Mức chi tiêu"} data={data} />
  </div>;
};

export default Top10KhachHangChiTieuNhieuNhat;