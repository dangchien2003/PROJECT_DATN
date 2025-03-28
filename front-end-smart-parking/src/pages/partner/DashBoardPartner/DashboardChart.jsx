import AreaChartCustom from "@/components/AreaChartCustom";
import DividerCustom from "@/components/DividerCustom";
import PieChartCustom from "@/components/PieChartCustom";
import React from "react";

const DashboardChart = () => {
  const dataPie = [
    {
      value: 1001,
      name: "cscs",
    },
    {
      value: 100,
      name: "cscs",
    },
  ];
  const dataArea = [
    { name: "01/01/2025", uv: 190 },
    { name: "02/01/2025", uv: 188 },
    { name: "03/01/2025", uv: 402 },
    { name: "04/01/2025", uv: 305 },
    { name: "05/01/2025", uv: 116 },
    { name: "06/01/2025", uv: 201 },
    { name: "07/01/2025", uv: 375 },
    { name: "08/01/2025", uv: 409 },
    { name: "09/01/2025", uv: 112 },
    { name: "10/01/2025", uv: 168 },
    { name: "11/01/2025", uv: 270 },
    { name: "12/01/2025", uv: 358 },
    { name: "13/01/2025", uv: 346 },
    { name: "14/01/2025", uv: 159 },
    { name: "15/01/2025", uv: 299 },
    { name: "16/01/2025", uv: 116 },
    { name: "17/01/2025", uv: 189 },
    { name: "18/01/2025", uv: 278 },
    { name: "19/01/2025", uv: 274 },
    { name: "20/01/2025", uv: 279 },
    { name: "21/01/2025", uv: 374 },
    { name: "22/01/2025", uv: 339 },
    { name: "23/01/2025", uv: 475 },
    { name: "24/01/2025", uv: 262 },
    { name: "25/01/2025", uv: 251 },
    { name: "26/01/2025", uv: 143 },
    { name: "27/01/2025", uv: 427 },
    { name: "28/01/2025", uv: 176 },
    { name: "29/01/2025", uv: 391 },
    { name: "30/01/2025", uv: 308 },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          paddingBottom: 50,
        }}
      >
        <PieChartCustom
          data={dataPie}
          nameChart={"Vé gia hạn - Không gia hạn"}
        />
        <PieChartCustom
          data={dataPie}
          nameChart={"Tỉ lệ sử dụng ở các khung giờ"}
        />
      </div>
      <DividerCustom style={{ width: "80%" }} />
      <div
        style={{
          paddingTop: 50,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AreaChartCustom
          data={dataArea}
          nameChart={"Biến động dòng tiền qua các ngày"}
          width={1000}
        />
      </div>
    </div>
  );
};

export default DashboardChart;
