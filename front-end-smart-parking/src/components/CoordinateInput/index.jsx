import { InputNumber, Row, Col } from "antd";
import { useEffect, useState } from "react";

const CoordinateInput = ({
  label,
  defaultValue = { x: null, y: null },
  onChange,
  min = -180,
  max = 180,
  step = 0.0001,
  disable,
}) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  
  const handleChange = (coord, val) => {
    const newValue = { ...value, [coord]: val };
    setValue(newValue);
    onChange?.(newValue);
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

      <Row gutter={8}>
        <Col span={12}>
          <InputNumber
            min={min}
            max={max}
            step={step}
            value={value?.x}
            onChange={(val) => handleChange("x", val)}
            placeholder="X"
            disabled={disable}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={12}>
          <InputNumber
            min={min}
            max={max}
            step={step}
            value={value?.y}
            onChange={(val) => handleChange("y", val)}
            placeholder="Y"
            disabled={disable}
            style={{ width: "100%" }}
            
          />
        </Col>
      </Row>
    </div>
  );
};

export default CoordinateInput;
