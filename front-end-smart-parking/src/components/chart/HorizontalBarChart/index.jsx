import ReactECharts from "echarts-for-react";

const HorizontalBarChart = ({
  Wapper,
  data = {},
  height = 400,
  nameChart,
  nameX }) => {
  const options = {
    grid: {
      left: "0%",
      right: "10px",
      top: "10px",
      bottom: "0%"
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: "{value}"
      },
      name: nameX,
      nameLocation: "middle",
      nameGap: 0
    },
    yAxis: {
      type: "category",
      data: data.categories,
      inverse: true,
      axisLine: {
        show: false
      },
      axisLabel: {
        // Giới hạn độ dài text
        formatter: function (value) {
          const maxLength = 15; // Điều chỉnh số ký tự tối đa
          if (value.length > maxLength) {
            return value.substring(0, maxLength) + '...';
          }
          return value;
        },
        // Thêm style cho label
        textStyle: {
          fontSize: 12,
          color: '#666'
        }
      }
    },
    // Thêm tooltip cho axis labels
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        const dataIndex = params[0].dataIndex;
        const fullName = data.categories[dataIndex];
        const value = params[0].value;
        return `<div style="font-weight: bold; margin-bottom: 4px;">${fullName}</div>
                <div><span style="font-weight: bold;">${value}</span></div>`;
      }
    },
    series: [
      {
        type: "bar",
        data: data.values,
        label: {
          show: true,
          position: "right",
          formatter: "{c}"
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
