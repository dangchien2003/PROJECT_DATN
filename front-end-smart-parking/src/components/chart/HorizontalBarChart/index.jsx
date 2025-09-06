import ReactECharts from "echarts-for-react";

const HorizontalBarChart = ({
  data = [],
  height = 400,
  nameChart }) => {
  // data mẫu
  const categories = [
    "Đại học Công Nghệ Đông Á",
    "Eaon mall hà đông",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
    "Cao tốc Bắc Kạn – Cao Bằng",
  ];

  const values = [10.5, 10.5, 40.1, 60.2, 80.2, 10.5, 10.5, 40.1, 60.2, 80.2];

  const options = {
    grid: {
      left: "25%",
      right: "10%",
      top: "5%",
      bottom: "5%"
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}%"
      }
    },
    yAxis: {
      type: "category",
      data: categories,
      inverse: true,
      axisLine: {
        show: false
      },
    },
    series: [
      {
        type: "bar",
        data: values,
        label: {
          show: true,
          position: "right",
          formatter: "{c}%"
        },
        itemStyle: {
          color: "#ff6b6b",
        },
        barWidth: 16
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
        {nameChart}
      </span>
      <ReactECharts option={options} style={{ height }} />
    </div>
  );
};

export default HorizontalBarChart;
