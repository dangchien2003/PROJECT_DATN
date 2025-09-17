import React from "react";
import ReactECharts from "echarts-for-react";

const CombinedBarLineChart = ({
  chartName = "",
  data = { categories: [], barData: [], lineData: [] },
  height = 400,
  description = { nameBar: "", nameLine: ""}
}) => {
  const { categories, barData, lineData } = data;

  const options = {
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0],
        start: 0,
        end: categories.length > 6 ? (6 / categories.length) * 100 : 100,
        zoomOnMouseWheel: true,
        moveOnMouseMove: true
      }
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      formatter: (params) => {
        let result = `<b>${params[0].axisValue}</b><br/>`;
        params.forEach((p) => {
          result += `<span style="display:inline-block;width:10px;height:10px;background:${p.color};margin-right:6px;border-radius:2px"></span>
                     ${p.seriesName}: <b>${p.value.toLocaleString()}</b>${p.seriesName === "Doanh thu" ? " ₫" : ""}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: [description.nameBar, description.nameLine],
      top: 8
    },
    grid: {
      left: "8%",
      right: "8%",
      top: 60,
      bottom: 60,
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: categories,
      axisTick: { show: false },
      axisLabel: { rotate: 45, interval: 0, textStyle: { fontSize: 10 } }
    },
    yAxis: [
      { type: "value", name: description.nameBar, position: "left", splitLine: { lineStyle: { color: "#f0f0f0" } } },
      {
        type: "value", name: description.nameLine, position: "right", splitLine: { show: false },
        axisLabel: { formatter: (val) => `${val / 1000}k` }
      }
    ],
    series: [
      { name: description.nameBar, type: "bar", data: barData, barWidth: 28, itemStyle: { color: "rgba(63,167,255,0.8)" }, yAxisIndex: 0 },
      {
        name: description.nameLine, type: "line", data: lineData, smooth: true, symbol: "circle", symbolSize: 6,
        lineStyle: { color: "#ff6b6b", width: 2 }, itemStyle: { color: "#ff6b6b" },
        areaStyle: {
          opacity: 0.25, color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: "rgba(255,107,107,0.5)" }, { offset: 1, color: "rgba(255,107,107,0.05)" }]
          }
        },
        yAxisIndex: 1
      }
    ]
  };

  return (
    <div
      style={{
        padding: 16,
        borderTop: "1px solid #B9B7B7",
        position: "relative",
        marginRight: 8,
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
        {chartName}
      </span>
      <ReactECharts
        option={options}
        style={{
          height,
          minWidth: "100%"
        }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};

export default CombinedBarLineChart;