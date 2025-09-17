import ReactECharts from "echarts-for-react";

const BarChartCustom = ({
  data = {},
  nameChart,
  height = 400,
  nameX,
  nameY
}) => {
  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        const param = params[0];
        return `<div style="font-weight: bold; margin-bottom: 4px;">${param.name}</div>
                <div>${nameY || 'Giá trị'}: <span style="font-weight: bold; ">${param.value.toLocaleString()}</span></div>`;
      },
    },
    grid: {
      left: "30px",
      right: "10px",
      top: "20px",
      bottom: "30px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: data.categories,
      name: nameX,
      nameLocation: "middle",
      nameGap: 30,
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      }
    },
    yAxis: {
      type: "value",
      name: nameY,
      nameLocation: "middle",
      nameGap: 40,
      nameRotate: 90,
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [
      {
        data: data.values,
        type: "bar",
        barWidth: '60%',
        itemStyle: {
          color: '#5470c6',
          borderRadius: [4, 4, 0, 0] // Bo góc phía trên
        },
        // Hiển thị số liệu trên đầu cột
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
          textStyle: {
            color: '#333',
            fontSize: 12,
            fontWeight: 'bold'
          }
        },
        // Hiệu ứng hover
        emphasis: {
          itemStyle: {
            color: '#4c9aff'
          }
        }
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
