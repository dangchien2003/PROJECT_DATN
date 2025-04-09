import { useEffect, useState } from "react";
import DateTimePickerWithSort from "../DateTimePickerWithSort";
import InputLabel from "../InputLabel";
import { useSelector } from "react-redux";
import InputError from "../InputError";

const DateTimePickerWithSortLabelDash = ({
  label,
  min,
  max,
  itemKey,
  callbackChangeValue,
  placeholder,
  format,
  formatShowTime,
  sort = true,
  defaultValue
}) => {
  const [value, setValue] = useState(defaultValue);
  const requireKeys = useSelector(state => state.requireField);
  const [require, setRequire] = useState(false)
  
  useEffect(()=> {
    if(Array.isArray(requireKeys) && itemKey) {
      setRequire(requireKeys.includes(itemKey))
    }
  }, [requireKeys, itemKey])

  useEffect(()=> {
    setValue(defaultValue);
  }, [defaultValue])
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
      <InputLabel label={label} key={itemKey} require={require}/>
      <DateTimePickerWithSort
        min={min}
        max={max}
        placeholder={placeholder}
        itemKey={itemKey}
        callbackChangeValue={callbackChangeValue}
        format={format}
        formatShowTime={formatShowTime}
        sort={sort}
        defaultValue={value}
        label={label}
      />
      <InputError itemKey={itemKey}/>
    </div>
  );
};

export default DateTimePickerWithSortLabelDash;
