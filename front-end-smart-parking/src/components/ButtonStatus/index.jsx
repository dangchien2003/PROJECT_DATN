import { Button } from "antd";
import React from "react";

const colors = {
  danger: {
    color: "danger", //#ff4d4f
    background: "#ffe8ec",
  }, // đỏ
  cyan: {
    color: "cyan",
    background: "#e1fcef",
  }, // xanh lá
  default: {
    color: "default",
    background: "#e8e8e8",
  }, // xám
  warning: {
    color: "#f6a621",
    border: "rgb(209, 163, 88)",
    background: "rgb(250, 239, 221)",
  },
};
const ButtonStatus = ({ label, color }) => {
  return (
    <Button
      type="default"
      color={colors[color]?.color}
      variant="outlined"
      style={{
        background: colors[color]?.background,
        fontWeight: 500,
        color:
          colors[color]?.color.slice(0, 1) === "#"
            ? colors[color]?.color
            : null,
        border: colors[color]?.border
          ? `1px solid ${colors[color]?.border}`
          : null,
        fontSize: 12,
        height: 24,
      }}
    >
      {label}
    </Button>
  );
};

export default ButtonStatus;
