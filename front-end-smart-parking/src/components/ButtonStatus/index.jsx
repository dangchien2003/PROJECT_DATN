import { Button } from "antd";
import React from "react";

const colors = {
  danger: {
    color: "danger",
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
};
const ButtonStatus = ({ label, color }) => {
  return (
    <div>
      <Button
        type="default"
        color={colors[color]?.color}
        variant="outlined"
        style={{ background: colors[color]?.background, fontWeight: 500 }}
      >
        {label}
      </Button>
    </div>
  );
};

export default ButtonStatus;
