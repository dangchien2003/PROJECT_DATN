import HorizontalBarChart from "@/components/chart/HorizontalBarChart";
import React from "react";
const Top10VeCoLuotMuaCaoNhat = ({month, year}) => {
  const data = {
    categories: ["Vé A", "Vé B", "Vé C", "Vé D"],
    values: [10, 11, 100, 10, 11, 100, 10, 11, 100]
  }
  return <div>
    <HorizontalBarChart nameChart={`Top 10 vé có lượt mua nhiều nhất - tháng ${month}/${year}`} nameX={"Số vé bán"} data={data} />
  </div>;
};

export default Top10VeCoLuotMuaCaoNhat;