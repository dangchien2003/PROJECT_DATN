import { DatePicker } from "antd";
import { useEffect, useState } from "react";

const DatePickerCustom = ({
  min,
  max,
  placeholder,
  itemKey,
  format,
  callbackChangeValue,
  disable
}) => {
  const [value, setValue] = useState(null);
  // kiểm tra min max
  const validMinMax = (value) => {
    if (min !== null && min !== undefined) {
      if (value.isBefore(min)) return min;
    }
    if (max !== null && max !== undefined) {
      if (value.isAfter(max)) return max;
    }
    return value;
  };
  // xử lý khi thay đổi dữ liệu
  const handleChangeValue = (value) => {
    value = validMinMax(value);
    setValue(value);
  };

  useEffect(() => {
    if (callbackChangeValue) {
      callbackChangeValue(value?.format(format), itemKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div style={{ display: "flex" }}>
      <DatePicker
        style={{ width: "100%" }}
        format={format}
        onChange={handleChangeValue}
        allowClear
        value={value}
        placeholder={placeholder}
        minDate={min}
        maxDate={max}
        disabled={disable}
      />
    </div>
  );
};

export default DatePickerCustom;
