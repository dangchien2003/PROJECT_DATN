import { Select } from "antd";
import { useEffect, useRef, useState } from "react";
import InputLabel from "../InputLabel";
import { useSelector } from "react-redux";
import InputError from "../InputError";

const SelectBoxLabelDash = ({
  placeholder,
  label,
  defaultValue,
  selectIndex,
  data = [],
  callbackChangeValue,
  regex,
  itemKey,
  prefix,
  requireKeys,
  dataError
}) => {
  const [value, setValue] = useState(
    selectIndex ? data[selectIndex] : defaultValue
  );
  const keyFocus = useSelector((state) => state.focus);
  const inputRef = useRef();
  const [require, setRequire] = useState(false)
  
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

  const handleChangeValue = (newValue) => {
    if(require) {
      if(newValue === null || newValue === undefined) {
        dataError[itemKey] = "Không được để trống trường " + label?.toLowerCase()
      } else {
        delete dataError[itemKey]
      }
    }

    if (newValue === "") {
      setValuePass("");
      return;
    }

    if (regex) {
      if (regex.test(newValue)) {
        setValuePass(newValue);
      }
    } else {
      setValuePass(newValue);
    }
  };

  const setValuePass = (newValue) => {
    setValue(newValue);
    if (callbackChangeValue) {
      callbackChangeValue(newValue, itemKey);
    }
  };

  const handleClear = () => setValuePass("");
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
      <Select
        ref={inputRef}
        style={{
          width: "100%",
        }}
        onChange={handleChangeValue}
        onClear={handleClear}
        prefix={prefix}
        value={value}
        allowClear
        placeholder={placeholder}
        options={data}
      />
      <InputError dataError={dataError} itemKey={itemKey}/>
    </div>
  );
};

export default SelectBoxLabelDash;
