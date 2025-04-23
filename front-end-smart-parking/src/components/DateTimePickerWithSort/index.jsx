import { DatePicker, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useMessageError } from "@/hook/validate";
import { getValueDate } from "@/utils/time";

const DateTimePickerWithSort = ({
  min = null,
  max = null,
  placeholder,
  itemKey,
  callbackChangeValue,
  format,
  formatShowTime = {
    format: "HH:mm:ss",
    defaultValue: dayjs("00:00:00", "HH:mm:ss"),
  },
  sort = true,
  defaultValue,
  label,
  disable
}) => {
  const [value, setValue] = useState(getValueDate(defaultValue));
  const requireKeys = useSelector(state => state.requireField);
  const [require, setRequire] = useState(false)
  const keyFocus = useSelector((state) => state.focus);
  const [sortOrder, setSortOrder] = useState(null);
  const inputRef = useRef();
  const {pushMessage, deleteKey} = useMessageError();
  useEffect(()=> {
    if(Array.isArray(requireKeys) && itemKey) {
      setRequire(requireKeys.includes(itemKey))
    }
  }, [requireKeys, itemKey])

  useEffect(()=> {
    if(keyFocus === itemKey) {
      inputRef.current?.focus();
    }
  }, [keyFocus, itemKey])

  useEffect(()=> {
    if(defaultValue?.trend !== undefined) {
    // khi có trend
      setSortOrder(defaultValue.trend);
      setValue(getValueDate(defaultValue.value));
    } else {
      // khi không có trend
      setValue(getValueDate(defaultValue));
    }
    
  // eslint-disable-next-line
  }, [defaultValue]) 
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
    if(value) {
      if (min !== null && min !== undefined) {
        if (value.isBefore(min)) return min;
      }
      if (max !== null && max !== undefined) {
        if (value.isAfter(max)) return max;
      }
      return value;
    }
  };
  // xử lý khi thay đổi dữ liệu
  const handleChangeValue = (newValue) => {
    newValue = validMinMax(newValue);
    if(require) {
      if(!newValue || newValue.length === 0) {
        pushMessage(itemKey, "Không được để trống trường " + label?.toLowerCase());
      } else {
        deleteKey(itemKey);
      }
    }
    setValue(newValue);
  };

  useEffect(() => {
    if (callbackChangeValue) {
      const formattedValue = value ? value.format("YYYY-MM-DDTHH:mm:ss") : null;
      callbackChangeValue(itemKey, formattedValue, sortOrder);
    }
  }, [sortOrder, value, callbackChangeValue, itemKey, format]);

  return (
    <div style={{ display: "flex" }}>
      <DatePicker
        ref={inputRef}
        style={{ width: "100%" }}
        showTime={formatShowTime}
        format={format}
        onChange={handleChangeValue}
        allowClear
        value={value}
        placeholder={placeholder}
        minDate={min}
        maxDate={max}
        disabled={disable}
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
