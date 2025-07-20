import { InputNumber, Row, Col } from "antd";
import { useEffect, useRef, useState } from "react";
import InputLabel from "../InputLabel";
import { useSelector } from "react-redux";
import { useMessageError } from "@/hook/validate";
import InputError from "../InputError";

const CoordinateInput = ({
  label,
  xInp,
  yInp,
  callbackChangeValue,
  min = -180,
  max = 180,
  step = 0.0001,
  disable,
  prefixKey,
  require
}) => {
  const keyFocus = useSelector((state) => state.focus);
  const inputRefX = useRef();
  const inputRefY = useRef();
  const { pushMessage, deleteKey } = useMessageError();
  const [x, setX] = useState(xInp);
  const [y, setY] = useState(yInp);
  const [key] = useState({
    x: prefixKey + "X",
    y: prefixKey + "Y",
  });

  useEffect(() => {
    setX(xInp);
    setY(yInp);
  }, [xInp, yInp])

  useEffect(() => {
    if (keyFocus === key.x) {
      inputRefX.current?.focus();
    } else if (keyFocus === key.y) {
      inputRefY.current?.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [keyFocus])

  const handleChange = (coord, val) => {
    if (coord === key.x) {
      setX(val);
    } else if (coord === key.y) {
      setY(val);
    }

    if (require) {
      if (coord === key.x) {
        if (val === null) {
          pushMessage(key.x, "Không được để trống trường X");
        } else {
          deleteKey(key.x);
        }
      }
      if (coord === key.y) {
        if (val === null) {
          pushMessage(key.y, "Không được để trống trường Y");
        } else {
          deleteKey(key.y);
        }
      }
    }

    if (callbackChangeValue) {
      callbackChangeValue(coord, val);
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
            onChange={(val) => handleChange(key.x, val)}
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
            onChange={(val) => handleChange(key.y, val)}
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
