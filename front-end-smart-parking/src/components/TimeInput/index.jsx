import { TimePicker } from "antd";
import { useEffect, useState } from "react";

const TimeInput = ({
  label,
  min,
  max,
  itemKey,
  callbackChangeValue,
  placeholder,
  format = "HH:mm:ss",
  defaultValue,
}) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const handleChange = (time) => {
    setValue(time);
    callbackChangeValue?.(time?.format(format), itemKey);
  };
  return (
    <div
      style={{
        position: "relative",
        width: 250,
        padding: "16px 8px",
        paddingBottom: 0,
        borderTop: "1px solid #B9B7B7",
        margin: 16,
      }}
    >
      <span
        className="truncated-text"
        style={{
          position: "absolute",
          display: "inline-block",
          padding: "3px 5px",
          top: -14,
          left: 8,
          maxWidth: 240,
          fontSize: 14,
          background: "white",
          zIndex: 100,
        }}
      >
        {label}
      </span>
      <TimePicker
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        itemKey={itemKey}
        onChange={handleChange}
        format={format}
        style={{width: "100%"}}
      />
    </div>
  );
};

export default TimeInput;
