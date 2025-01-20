import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartCustom = ({
  width = 400,
  height = 400,
  data = [],
  colors = COLORS,
  nameChart,
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
      <PieChart width={width} height={height}>
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
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </div>
  );
};

export default PieChartCustom;
