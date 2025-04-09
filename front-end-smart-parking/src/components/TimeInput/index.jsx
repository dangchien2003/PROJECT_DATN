import { useMessageError } from "@/hook/validate";
import { TimePicker } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import InputLabel from "../InputLabel";
import InputError from "../InputError";
import dayj from "dayjs";

const TimeInput = ({
  label,
  min,
  max,
  itemKey,
  callbackChangeValue,
  placeholder,
  format = "HH:mm:ss",
  defaultValue,
  disable
}) => {
  const [value, setValue] = useState(defaultValue);
  const keyFocus = useSelector((state) => state.focus);
  const requireKeys = useSelector(state => state.requireField);
  const inputRef = useRef();
  const [require, setRequire] = useState(false)
  const {pushMessage, deleteKey} = useMessageError();

  useEffect(()=> {
    if(Array.isArray(requireKeys) && itemKey) {
      setRequire(requireKeys.includes(itemKey))
    }
  }, [requireKeys, itemKey])

  useEffect(()=> {
    if(keyFocus === itemKey) {
      inputRef.current?.focus();
    }
  }, [keyFocus, itemKey])

  const handleChange = (newValue) => {
    if(require) {
      if(!newValue || newValue.length === 0) {
        pushMessage(itemKey, "Không được để trống trường " + label?.toLowerCase());
      } else {
        deleteKey(itemKey);
      }
    }
    setValue(newValue);
  };

  useEffect(() => {
    const newValue = defaultValue ? dayj(defaultValue, "HH:mm:ss") : null;
    handleChange(newValue)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  useEffect(() => {
    if (callbackChangeValue) {
      const formattedValue = value ? value.format("HH:mm:ss") : null;
      callbackChangeValue(itemKey, formattedValue);
    }
  }, [value, callbackChangeValue, itemKey, format]);
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
      <TimePicker
        ref={inputRef}
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        itemKey={itemKey}
        onChange={handleChange}
        format={format}
        style={{width: "100%"}}
        disabled={disable}
      />
      <InputError itemKey={itemKey}/>
    </div>
  );
};

export default TimeInput;
