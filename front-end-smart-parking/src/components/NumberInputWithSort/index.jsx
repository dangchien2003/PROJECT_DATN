import { Input, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { formatCurrency, parseFormattedCurrency } from "@/utils/number";

const NumberInputWithSort = ({
  min,
  max,
  addonAfter,
  placeholder,
  itemKey,
  callbackChangeValue,
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
      callbackChangeValue(parseFormattedCurrency(value), sortOrder, itemKey);
    }
  }, [sortOrder, value, callbackChangeValue, itemKey]);

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
      <div
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
      </div>
    </div>
  );
};

export default NumberInputWithSort;
