import React from "react";
import { Select } from "antd";

const { Option } = Select;

const MonthSelect = ({ onChange }) => {
  return (
    <Select
      placeholder="Chọn tháng"
      style={{ width: 200 }}
      onChange={onChange}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <Option key={i + 1} value={i + 1}>
          Tháng {i + 1}
        </Option>
      ))}
    </Select>
  );
};

export default MonthSelect;