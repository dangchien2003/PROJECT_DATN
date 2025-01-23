import React from "react";
import NumberInputWithSort from "../NumberInputWithSort";

const NumberInputWithSortLabelDash = ({
  label,
  min,
  max,
  addonAfter = false,
  placeholder,
}) => {
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
      <NumberInputWithSort
        min={min}
        max={max}
        placeholder={placeholder}
        addonAfter={addonAfter}
      />
    </div>
  );
};

export default NumberInputWithSortLabelDash;
