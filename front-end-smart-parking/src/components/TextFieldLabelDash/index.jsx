import { Input } from "antd";
import { useRef, useEffect, useState } from "react";
import InputError from "../InputError";
import { useSelector } from "react-redux";
import InputLabel from "../InputLabel";
import { useMessageError } from "@/hook/validate";

const TextFieldLabelDash = ({
  placeholder,
  label,
  defaultValue = "",
  callbackChangeValue,
  regex,
  prefix,
  itemKey,
  disable,
  maxLength,
  minLength,
  color
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

  useEffect(() => {
    if (value !== defaultValue) {
      setValue(defaultValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const handleChangeValue = (e) => {
    const newValue = e.target.value;
    const sizePrefix = prefix !== undefined && prefix !== null ? prefix?.toString().length : 0;
    if(require) {
      if(newValue.length === 0) {
        pushMessage(itemKey, "Không được để trống trường " + label?.toLowerCase());
      } else {
        deleteKey(itemKey);
      }
    }

    if(minLength) {
      if(newValue.length + sizePrefix < minLength) {
        pushMessage(itemKey, "Dữ liệu " + label?.toLowerCase() + " chưa đủ " + minLength + " ký tự");
      } else {
        deleteKey(itemKey);
      }
    }

    if(maxLength) {
      if(newValue.length + sizePrefix > maxLength) {
        return;
      }
    }

    if (newValue === "") {
      setValuePass(null);
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

  const handleBlur = (e) => {
    const newValue = e.target.value;
    setValuePass(newValue.trim());
  }

  const setValuePass = (newValue) => {
    setValue(newValue);
    if (callbackChangeValue) {
      if(prefix !== undefined) {
        callbackChangeValue(itemKey, prefix + newValue);
      } else {
        callbackChangeValue(itemKey, newValue);
      }
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
      <Input
        ref={inputRef}
        placeholder={placeholder}
        allowClear
        value={value}
        onChange={handleChangeValue}
        onBlur={handleBlur}
        onClear={handleClear}
        prefix={prefix}
        disabled={disable}
        style={color ? {color: color} : {}}
      />
      <InputError itemKey={itemKey}/>
    </div>
  );
};

export default TextFieldLabelDash;
