import React from 'react';
import ReactECharts from "echarts-for-react";

const GroupedBarChart = ({
  data = {},
  height = 400,
  nameChart,
  colors = ['#5FB3F5', '#F5D142'],
  showLabels = true,
  showLegend = true,
  seriesNames = ['Series 1', 'Series 2'],
  yAxisName = '',
  unit = ''
}) => {
  const options = {
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 50, // Luôn hiển thị một phần nhỏ của biểu đồ
        zoomOnMouseWheel: true,
        moveOnMouseMove: true
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].name}</div>`;
        params.forEach(param => {
          result += `<div style="margin: 4px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; margin-right: 8px;"></span>
            ${param.seriesName}: <span style="font-weight: bold;">${param.value.toLocaleString()}${unit}</span>
          </div>`;
        });
        return result;
      },
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      show: showLegend,
      data: seriesNames,
      bottom: 10,
      itemGap: 20,
      textStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    grid: {
      left: "0%",
      right: "10px",
      top: "20px",
      bottom: "0%",
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categories || [],
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        rotate: 45,
        interval: 0,
        margin: 70,
        align: 'left',
        width: 100,
        overflow: 'truncate',
        ellipsis: '...',
        textStyle: {
          fontSize: 11,
          color: '#666'
        },
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      name: yAxisName,
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        fontSize: 12,
        color: '#666'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        formatter: `{value}${unit}`,
        textStyle: {
          fontSize: 11,
          color: '#666'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: seriesNames[0],
        type: 'bar',
        data: data.series1 || [],
        itemStyle: {
          color: colors[0],
          borderRadius: [2, 2, 0, 0]
        },
        label: {
          show: showLabels,
          position: 'top',
          formatter: `{c}${unit}`,
          textStyle: {
            fontSize: 10,
            color: '#333',
            fontWeight: 'bold'
          }
        },
        barGap: '20%',
        barCategoryGap: '40%'
      },
      {
        name: seriesNames[1],
        type: 'bar',
        data: data.series2 || [],
        itemStyle: {
          color: colors[1],
          borderRadius: [2, 2, 0, 0]
        },
        label: {
          show: showLabels,
          position: 'top',
          formatter: `{c}${unit}`,
          textStyle: {
            fontSize: 10,
            color: '#333',
            fontWeight: 'bold'
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
      <ReactECharts
        option={options}
        style={{ 
          height, 
          minWidth: data.categories && data.categories.length > 5 
            ? `${data.categories.length * 100}px` 
            : '100%' 
        }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default GroupedBarChart;
