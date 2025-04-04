import { Input } from "antd";
import { useEffect, useState } from "react";

import { formatCurrency, parseFormattedCurrency } from "@/utils/number";
import TrendInput from "../TrendInput";

const NumberInputWithSort = ({
  min,
  max,
  addonAfter,
  placeholder,
  itemKey,
  callbackChangeValue,
}) => {
  const [value, setValue] = useState(null);

  // kiểm tra min max
  const validMinMax = (value) => {
    if (min !== null && min !== undefined) {
      if (value < min) return min;
    }
    if (max !== null && max !== undefined) {
      if (value > max) return max;
    }
    return value;
  };
  // xử lý khi thay đổi dữ liệu
  const handleChangeValue = (e) => {
    // chuyển về dạng số
    var valueNumber = parseFormattedCurrency(e.target.value);
    valueNumber = validMinMax(valueNumber);
    const formattedValue = valueNumber
      ? formatCurrency(valueNumber)
      : valueNumber;
    setValue(formattedValue);
  };

  useEffect(() => {
    if (callbackChangeValue) {
      let valueParse = parseFormattedCurrency(value);
      if(valueParse === '') {
        valueParse = null
      }
      callbackChangeValue(itemKey, valueParse , null, "trend");
    }
  }, [value, callbackChangeValue, itemKey]);

  return (
    <div style={{ display: "flex" }}>
      <Input
        style={{ width: "100%" }}
        addonAfter={addonAfter}
        placeholder={placeholder}
        value={value}
        allowClear
        onChange={handleChangeValue}
        controls={false}
      />
      <TrendInput key={"trend"} itemKey={itemKey} callbackChangeValue={callbackChangeValue}/>
    </div>
  );
};

export default NumberInputWithSort;
