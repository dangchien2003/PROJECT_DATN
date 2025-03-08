import { Input } from "antd";
import { useState } from "react";

const TextFieldLabelDash = ({
  placeholder,
  label,
  defaultValue = "",
  callbackChangeValue,
  regex,
  prefix,
  itemKey,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChangeValue = (e) => {
    const newValue = e.target.value;

    if (newValue === "") {
      setValuePass("");
      return;
    }

    if (regex) {
      console.log(regex)
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
      <Input
        placeholder={placeholder}
        allowClear
        value={value}
        onChange={handleChangeValue}
        onClear={handleClear}
        prefix={prefix}
      />
    </div>
  );
};

export default TextFieldLabelDash;
