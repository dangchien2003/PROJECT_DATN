import ReactECharts from "echarts-for-react";

const PieChartCustom = ({
  data = [],
  nameChart,
  height = 400
}) => {
  const options = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: nameChart,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
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
      <ReactECharts option={options} style={{height}}/>
    </div>
  );
};

export default PieChartCustom;
