import React from "react";
import { Select } from "antd";

const { Option } = Select;

const YearSelect = ({ onChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i);

  return (
    <Select
      placeholder="Chọn năm"
      style={{ width: 200 }}
      onChange={onChange}
    >
      {years.map((year) => (
        <Option key={year} value={year}>
          {year}
        </Option>
      ))}
    </Select>
  );
};

export default YearSelect;
