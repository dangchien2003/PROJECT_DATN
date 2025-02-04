import { COLORS_CHART } from "@/utils/constants";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const CustomTooltip = ({ active, payload, convert }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          padding: "8px 12px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#666" }}>
          {payload[0].name}
        </p>
        <p style={{ margin: 0, color: payload[0].payload.fill }}>
          {convert ? convert(payload[0].value) : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const PieChartCustom = ({
  width = 400,
  height = 400,
  data = [],
  colors = COLORS_CHART,
  nameChart,
  convert,
}) => {
  return (
    <div
      style={{
        display: "inline-block",
        padding: 16,
        border: "1px solid #B9B7B7",
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -18,
          left: 16,
          background: "white",
          padding: "3px 4px",
          fontSize: 20,
          color: "#666666",
        }}
      >
        {nameChart}
      </span>
      <PieChart width={width} height={data.length < 4 ? height : height + 50}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip convert={convert} />} />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </div>
  );
};

export default PieChartCustom;
