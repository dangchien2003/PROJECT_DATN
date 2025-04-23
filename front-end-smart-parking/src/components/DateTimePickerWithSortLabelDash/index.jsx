import { useEffect, useState } from "react";
import DateTimePickerWithSort from "../DateTimePickerWithSort";
import InputLabel from "../InputLabel";
import InputError from "../InputError";
import HelpText from "../Helptext";

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
  defaultValue,
  helpText,
  disable
}) => {
  const [value, setValue] = useState(defaultValue);

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
      <InputLabel label={label} key={itemKey} itemKey={itemKey}/>
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
        disable={disable}
      />
      <HelpText helpText={helpText}/>
      <InputError itemKey={itemKey}/>
    </div>
  );
};

export default DateTimePickerWithSortLabelDash;
