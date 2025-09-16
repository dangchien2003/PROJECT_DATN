import React, { useState, useEffect } from "react";
import { Select, Space } from "antd";

const { Option } = Select;

const MonthYearSelect = ({ onChange }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const getMonths = () => {
    const maxMonth = year === currentYear ? currentMonth : 12;
    return Array.from({ length: maxMonth }, (_, i) => i + 1);
  };

  useEffect(() => {
    if (onChange) {
      onChange({ year, month });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [year, month]);

  return (
    <Space>
      <Select
        value={month}
        style={{ width: 120 }}
        onChange={(value) => setMonth(value)}
      >
        {getMonths().map((m) => (
          <Option key={m} value={m}>
            Tháng {m}
          </Option>
        ))}
      </Select>
      <Select
        value={year}
        style={{ width: 120 }}
        onChange={(value) => {
          setYear(value);
          const maxMonth = value === currentYear ? currentMonth : 12;
          if (month > maxMonth) {
            setMonth(maxMonth);
          }
        }}
      >
        {years.map((y) => (
          <Option key={y} value={y}>
            {y}
          </Option>
        ))}
      </Select>
    </Space>
  );
};

export default MonthYearSelect;
