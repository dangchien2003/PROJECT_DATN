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
  const inputRef = useRef();
  const [require, setRequire] = useState(false)
  const {pushMessage, deleteKey} = useMessageError();

  useEffect(() => {
    if(Array.isArray(requireKeys) && itemKey) {
      setRequire(requireKeys.includes(itemKey))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requireKeys, value]);

  useEffect(()=> {
    if(keyFocus === itemKey) {
      inputRef.current?.focus();
    }
  }, [keyFocus, itemKey])
  
  const handleChange = (coord, val) => {
    const newValue = { ...value, [coord]: val };
    if(require) {
      if(newValue.length === 0) {
        pushMessage(itemKey, "Không được để trống trường " + label?.toLowerCase());
      } else {
        deleteKey(itemKey);
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
      <InputLabel label={label} require={require}/>
      <Row gutter={8}>
        <Col span={12}>
          <InputNumber
            ref={inputRef}
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
      <InputError itemKey={itemKey}/>
    </div>
  );
};

export default CoordinateInput;
