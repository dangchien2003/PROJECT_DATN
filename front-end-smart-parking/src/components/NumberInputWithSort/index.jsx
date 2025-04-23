import { Input } from "antd";
import { useEffect, useRef, useState } from "react";

import { formatCurrency, parseFormattedCurrency } from "@/utils/number";
import TrendInput from "../TrendInput";
import { useSelector } from "react-redux";
import { useMessageError } from "@/hook/validate";

const NumberInputWithSort = ({
  min,
  max,
  addonAfter,
  placeholder,
  itemKey,
  callbackChangeValue,
  trend,
  label
}) => {
  const [value, setValue] = useState(null);
  const keyFocus = useSelector((state) => state.focus);
  const inputRef = useRef();
  const {pushMessage, deleteKey} = useMessageError();

  useEffect(()=> {
    if(keyFocus === itemKey) {
      inputRef.current?.focus();
    }
  }, [keyFocus, itemKey])
  
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
    const newValue = e.target.value;
    // validate require
    if(require) {
      if(newValue.length === 0) {
        pushMessage(itemKey, "Không được để trống trường " + label?.toLowerCase());
      } else {
        deleteKey(itemKey);
      }
    }
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
        ref={inputRef}
        style={{ width: "100%" }}
        addonAfter={addonAfter}
        placeholder={placeholder}
        value={value}
        allowClear
        onChange={handleChangeValue}
        controls={false}
      />
      {trend && <TrendInput key={"trend"} itemKey={itemKey} callbackChangeValue={callbackChangeValue}/>}
    </div>
  );
};

export default NumberInputWithSort;
