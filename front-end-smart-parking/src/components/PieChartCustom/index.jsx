import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartCustom = ({ width = 400, height = 400, data = [], colors = COLORS }) => {
  return (
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
  );
};

export default PieChartCustom;
