import { Divider } from "antd";
import React from "react";

const DividerCustom = ({ style = { width: "100%" } }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={style}>
        <Divider />
      </div>
    </div>
  );
};

export default DividerCustom;
