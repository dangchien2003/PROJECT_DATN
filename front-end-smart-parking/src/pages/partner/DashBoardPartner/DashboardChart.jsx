import AreaChartCustom from "@/components/AreaChartCustom";
import DividerCustom from "@/components/DividerCustom";
import PieChartCustom from "@/components/chart/PieChartCustom";
import { Col, Row } from "antd";
import React from "react";

const DashboardChart = () => {
  const dataPie = [
    {
      value: 1001,
      name: "cscs",
    },
    {
      value: 100,
      name: "csc1s",
    },
  ];
  const dataArea = {
    "x": [
      "01/09/2025",
      "02/09/2025",
      "03/09/2025",
      "04/09/2025",
      "05/09/2025",
      "06/09/2025",
      "07/09/2025",
      "08/09/2025",
      "09/09/2025",
      "10/09/2025",
      "11/09/2025",
      "12/09/2025",
      "13/09/2025",
      "14/09/2025",
      "15/09/2025",
      "16/09/2025",
      "17/09/2025",
      "18/09/2025",
      "19/09/2025",
      "20/09/2025",
      "21/09/2025",
      "22/09/2025",
      "23/09/2025",
      "24/09/2025",
      "25/09/2025",
      "26/09/2025",
      "27/09/2025",
      "28/09/2025",
      "29/09/2025",
      "30/09/2025"
    ],
    "y": [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      5000,
      0,
      0
    ]
  }
  return (
    <div>
      <Row>
        <Col sm={24} md={24} lg={12}>
          <PieChartCustom
            data={dataPie}
            nameChart={"Vé gia hạn - Không gia hạn"}
          />
        </Col>
        <Col sm={24} md={24} lg={12}>
          <PieChartCustom
            data={dataPie}
            nameChart={"Tỉ lệ sử dụng ở các khung giờ"}
          /></Col>
      </Row>
      <DividerCustom style={{ width: "80%" }} />
      <div
      >
        <AreaChartCustom
          data={dataArea}
          nameChart={"Biến động dòng tiền qua các ngày"}
          height={500}
        />
      </div>
    </div>
  );
};

export default DashboardChart;
