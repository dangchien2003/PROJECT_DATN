import InputError from '@/components/InputError';
import { useMessageError } from '@/hook/validate';
import { Input } from 'antd'
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const InputAuthen = ({
  itemKey,
  callbackChangeValue,
  defaultValue = "",
  maxLength,
  placeholder,
  fieldName,
  isPassword
}) => {
  const [value, setValue] = useState(isPassword ? null : defaultValue);
  const keyFocus = useSelector((state) => state.focus);
  const inputRef = useRef();
  const { pushMessage, deleteKey } = useMessageError();

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    if (keyFocus === itemKey) {
      inputRef.current?.focus();
    }
  }, [keyFocus, itemKey])

  const handleClear = () => setValue("");

  const handleChangeValue = (e) => {
    const newValue = e.target.value;
    if (newValue.length === 0) {
      pushMessage(itemKey, "Không được để trống trường " + fieldName?.toLowerCase());
    } else {
      deleteKey(itemKey);
    }

    if (maxLength) {
      if (newValue.length > maxLength) {
        return;
      }
    }

    if (newValue === "") {
      setValuePass(null);
      return;
    } else {
      setValuePass(newValue);
    }
  }

  const setValuePass = (newValue) => {
    setValue(newValue);
    if (callbackChangeValue) {
      callbackChangeValue(itemKey, newValue);
    }
  };

  const handleBlur = (e) => {
    const newValue = e.target.value;
    setValuePass(newValue.trim());
  }

  return (
    <div className='parent-input'>
      {isPassword ? <Input.Password
        className="input-authen"
        placeholder={placeholder}
        onChange={handleChangeValue}
        onBlur={handleBlur}
        onClear={handleClear}
        ref={inputRef}
        value={value}
        visibilityToggle
      />
        : <Input
          className="input-authen"
          placeholder={placeholder}
          onChange={handleChangeValue}
          onBlur={handleBlur}
          onClear={handleClear}
          ref={inputRef}
          value={value}
        />}
      <InputError itemKey={itemKey} isAuthen={true} />
    </div>
  )
}

export default InputAuthen
