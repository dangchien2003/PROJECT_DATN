import ReactECharts from "echarts-for-react";

const BarChartCustom = ({
  data = [],
  nameChart,
  height = 400,
  nameX,
  nameY
}) => {
  const options = {
    xAxis: {
      type: "category",
      data: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
      name: nameX,
      nameLocation: "middle",
      nameGap: 30
    },
    yAxis: {
      type: "value",
      name: nameY,
      nameLocation: "middle",
      nameGap: 50
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130, 150, 80, 70, 110, 130],
        type: "bar"
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

export default BarChartCustom;
