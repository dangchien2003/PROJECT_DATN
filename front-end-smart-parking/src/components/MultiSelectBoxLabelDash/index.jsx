import { Select } from "antd";
import { useState } from "react";

const MultiSelectBoxLabelDash = ({
  placeholder,
  label,
  defaultValue,
  selectIndex,
  data = [],
  callbackChangeValue,
  regex,
  itemKey,
  prefix,
}) => {
  const [value, setValue] = useState(
    selectIndex ? data[selectIndex] : defaultValue
  );

  const handleChangeValue = (newValue) => {
    if (newValue === "") {
      setValuePass("");
      return;
    }

    if (regex) {
      if (regex.test(newValue)) {
        setValuePass(newValue);
      }
    } else {
      setValuePass(newValue);
    }
  };

  const setValuePass = (newValue) => {
    setValue(newValue);
    if (callbackChangeValue) {
      callbackChangeValue(newValue, itemKey);
    }
  };

  const handleClear = () => setValuePass("");
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
      <Select
        mode="multiple"
        style={{
          width: "100%",
        }}
        onChange={handleChangeValue}
        onClear={handleClear}
        prefix={prefix}
        value={value}
        allowClear
        placeholder={placeholder}
        options={data}
      />
    </div>
  );
};

export default MultiSelectBoxLabelDash;
