import { useState } from "react";
import { Checkbox } from "antd";

const CheckboxWithDash = ({
  label,
  itemKey,
  value = false,
  callbackChangeValue,
  require,
}) => {
  const [checked, setChecked] = useState(value ? value : false)
  const handleChange = (e) => {
    if (callbackChangeValue) {
      const newChecked = e.target.checked;
      callbackChangeValue(newChecked, itemKey)
      setChecked(newChecked)
    }
  }
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
        {/* {label} */}
        {require && <span style={{ color: "red" }}> *</span>}
      </span>
      <Checkbox onChange={handleChange} checked={checked}>{label}</Checkbox>
    </div>
  );
};

export default CheckboxWithDash;
