import { DatePicker, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import dayjs from "dayjs";

const DateTimePickerWithSort = ({
  min,
  max,
  placeholder,
  itemKey,
  callbackChangeValue,
  format,
  formatShowTime = {
    format: "HH:mm:ss",
    defaultValue: dayjs("00:00:00", "HH:mm:ss"),
  },
  sort = true
}) => {
  const [value, setValue] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  // xử lý khi thay đổi cách sắp xếp
  const handleSortChange = (order) => {
    if (sortOrder !== order) {
      setSortOrder(order);
    } else {
      setSortOrder(undefined);
    }
  };
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
      callbackChangeValue(value?.format(format), sortOrder, itemKey);
    }
  }, [sortOrder, value, callbackChangeValue, itemKey, format]);

  return (
    <div style={{ display: "flex" }}>
      <DatePicker
        style={{ width: "100%" }}
        showTime={formatShowTime}
        format={format}
        onOk={handleChangeValue}
        allowClear
        value={value}
        placeholder={placeholder}
        minDate={min}
        maxDate={max}
      />
      {sort && <div
        style={{
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Tooltip key={"asc"} title={"Lớn hơn hoặc bằng"}>
          <div
            className="cursor-pointer"
            onClick={() => {
              handleSortChange("asc");
            }}
          >
            <FaAngleUp style={sortOrder === "asc" && { color: "#22a2fe" }} />
          </div>
        </Tooltip>
        <Tooltip key={"desc"} title={"Nhỏ hơn hoặc bằng"}>
          <div
            className="cursor-pointer"
            onClick={() => {
              handleSortChange("desc");
            }}
          >
            <FaAngleDown style={sortOrder === "desc" && { color: "#22a2fe" }} />
          </div>
        </Tooltip>
      </div>}
    </div>
  );
};

export default DateTimePickerWithSort;
