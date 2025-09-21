import { formatCurrency } from "@/utils/number";
import ReactECharts from "echarts-for-react";


const AreaChartCustom = ({ data, nameChart, height, nameX, nameY }) => {
  const options = {
    grid: {
      left: 50,
      right: 0,
      top: 20,
      bottom: 50,
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const { name, value } = params[0];
        return `
        <div style="padding:6px 10px;">
          <strong>${name}</strong><br/>
          Giá trị: ${formatCurrency(value)}
        </div>
      `;
      },
      axisPointer: {
        type: "cross"
      }
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      name: nameX,
      nameLocation: "middle",
      nameGap: 50,
      nameTextStyle: {
        fontSize: 14,
        color: "#666"
      },
      data: data.x
    },
    yAxis: {
      type: "value",
      name: nameY,
      nameLocation: "middle",
      nameGap: 50,
      nameTextStyle: {
        fontSize: 14,
        color: "#666"
      }
    },
    series: [
      {
        data: data.y,
        type: "line",
        smooth: true,
        areaStyle: {}
      }
    ]
  };
  return (
    <div
      style={{
        paddingTop: 24,
        borderTop: "1px solid #B9B7B7",
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
      <ReactECharts option={options} style={{ height }} />
    </div>
  );
};

export default AreaChartCustom;
