import { useEffect, useState } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { Tooltip } from "antd";

const key = {
  up: "up",
  down: "down"
}
const TrendInput = ({callbackChangeValue, itemKey}) => {
  const [trend, setTrend] = useState(null);
  
  useEffect(() => {
      if (callbackChangeValue) {
        callbackChangeValue(itemKey, null, trend, "value");
      }
    }, [trend, callbackChangeValue, itemKey]);

  const handleSortChange = (value) => {
    if (trend !== value) {
      setTrend(value);
    } else {
      setTrend(null);
    }
  };
  return (
    <div
      style={{
        fontSize: 14,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Tooltip key={key.up} title={"Lớn hơn hoặc bằng"}>
        <div
          className="cursor-pointer"
          onClick={() => {
            handleSortChange(key.up);
          }}
        >
          <FaAngleUp style={trend === key.up && { color: "#22a2fe" }} />
        </div>
      </Tooltip>
      <Tooltip key={key.down} title={"Nhỏ hơn hoặc bằng"}>
        <div
          className="cursor-pointer"
          onClick={() => {
            handleSortChange(key.down);
          }}
        >
          <FaAngleDown style={trend === key.down && { color: "#22a2fe" }} />
        </div>
      </Tooltip>
    </div>
  )
}

export default TrendInput
