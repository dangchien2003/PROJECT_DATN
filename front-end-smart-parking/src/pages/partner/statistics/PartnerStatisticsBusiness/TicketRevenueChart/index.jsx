import React from "react";
import ReactECharts from "echarts-for-react";
const data = [
  { location: "Đại học Công Nghệ Đông Á", tickets: 120, revenue: 2000 },
  { location: "Đại học Công Nghệ Đông Á", tickets: 200, revenue: 3500 },
  { location: "Đại học Công Nghệ Đông Á", tickets: 150, revenue: 2800 },
  { location: "Đại học Công Nghệ Đông Á", tickets: 80, revenue: 1200 },
  { location: "Đại học Công Nghệ Đông Á", tickets: 70, revenue: 900 }
];
const TicketRevenueChart = ({ height = 420, year, month }) => {
  const categories = data.map(item => item.location);
  const tickets = data.map(item => item.tickets);
  const revenue = data.map(item => item.revenue);

  const options = {
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
      data: ["Số vé bán", "Doanh thu"],
      top: 8
    },
    grid: {
      left: "8%",
      right: "8%",
      top: 60,
      bottom: 40,
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: categories,
      axisTick: { show: false },
      axisLabel: {
        rotate: 45,
        interval: 0,
        textStyle: {
          fontSize: 10
        }
      }
    },
    yAxis: [
      {
        type: "value",
        name: "Số vé",
        position: "left",
        splitLine: { lineStyle: { color: "#f0f0f0" } }
      },
      {
        type: "value",
        name: "Doanh thu (₫)",
        position: "right",
        splitLine: { show: false },
        axisLabel: {
          formatter: (val) => `${val / 1000}k`
        }
      }
    ],
    series: [
      {
        name: "Số vé bán",
        type: "bar",
        data: tickets,
        barWidth: 28,
        itemStyle: {
          color: "rgba(63,167,255,0.8)"
        },
        yAxisIndex: 0
      },
      {
        name: "Doanh thu",
        type: "line",
        data: revenue,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          color: "#ff6b6b",
          width: 2
        },
        itemStyle: {
          color: "#ff6b6b"
        },
        areaStyle: {
          opacity: 0.25,
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(255,107,107,0.5)" },
              { offset: 1, color: "rgba(255,107,107,0.05)" }
            ]
          }
        },
        yAxisIndex: 1
      }
    ]
  };

  return <div
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
      Doanh thu địa điểm - tháng {month}/{year}
    </span>
    <ReactECharts option={options} style={{ height }} />
  </div>;
};

export default TicketRevenueChart;