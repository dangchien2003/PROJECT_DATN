import { InputNumber, Row, Col } from "antd";
import { useEffect, useRef, useState } from "react";
import InputLabel from "../InputLabel";
import { useSelector } from "react-redux";
import { useMessageError } from "@/hook/validate";
import InputError from "../InputError";

const CoordinateInput = ({
  label,
  value = { x: null, y: null },
  callbackChangeValue,
  min = -180,
  max = 180,
  step = 0.0001,
  disable,
  itemKey
}) => {
  const keyFocus = useSelector((state) => state.focus);
  const requireKeys = useSelector(state => state.requireField);
  const inputRefX = useRef();
  const inputRefY = useRef();
  const [require, setRequire] = useState(false)
  const { pushMessage, deleteKey } = useMessageError();
  const [x, setX] = useState(value.x);
  const [y, setY] = useState(value.y);
  const [key] = useState({
    x: itemKey + ".x",
    y: itemKey + ".y",
  });

  useEffect(() => {
    setX(value?.x);
    setY(value?.y);
  }, [value])

  useEffect(() => {
    if (Array.isArray(requireKeys) && itemKey) {
      setRequire(requireKeys.includes(itemKey))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requireKeys, itemKey]);

  useEffect(() => {
    if (keyFocus === itemKey + ".x") {
      inputRefX.current?.focus();
    } else if (keyFocus === itemKey + ".y") {
      inputRefY.current?.focus();
    }
  }, [keyFocus, itemKey])

  const handleChange = (coord, val) => {
    let x1 = x;
    let y1 = y;
    if (coord === "x") {
      setX(val);
      x1 = val;
    } else if (coord === "y") {
      setY(val);
      y1 = val;
    }

    const newValue = { x: x1, y: y1 };
    if (require) {
      if (coord === "x") {
        if (newValue.x === null) {
          pushMessage(key.x, "Không được để trống trường X");
        } else {
          deleteKey(key.x);
        }
      }
      if (coord === "y") {
        if (newValue.y === null) {
          pushMessage(key.y, "Không được để trống trường Y");
        } else {
          deleteKey(key.y);
        }
      }
    }

    if (callbackChangeValue) {
      callbackChangeValue(itemKey, newValue);
    }
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
      <InputLabel label={label} require={require} />
      <Row gutter={8}>
        <Col span={12}>
          <InputNumber
            ref={inputRefX}
            min={min}
            max={max}
            step={step}
            value={x}
            onChange={(val) => handleChange("x", val)}
            placeholder="X"
            disabled={disable}
            style={{ width: "100%" }}
          />
          <InputError itemKey={key.x} />
        </Col>
        <Col span={12}>
          <InputNumber
            ref={inputRefY}
            min={min}
            max={max}
            step={step}
            value={y}
            onChange={(val) => handleChange("y", val)}
            placeholder="Y"
            disabled={disable}
            style={{ width: "100%" }}
          />
          <InputError itemKey={key.y} />
        </Col>
      </Row>
    </div>
  );
};

export default CoordinateInput;
