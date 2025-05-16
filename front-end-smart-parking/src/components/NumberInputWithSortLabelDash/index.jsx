import NumberInputWithSort from "../NumberInputWithSort";
import InputError from "../InputError";
import InputLabel from "../InputLabel";

const NumberInputWithSortLabelDash = ({
  label,
  min,
  max,
  addonAfter = false,
  itemKey,
  callbackChangeValue,
  placeholder,
  require,
  trend = true,
  defaultValue = null,
}) => {
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
      <InputLabel label={label} require={require} itemKey={itemKey}/>
      <NumberInputWithSort
        min={min}
        max={max}
        placeholder={placeholder}
        itemKey={itemKey}
        addonAfter={addonAfter}
        callbackChangeValue={callbackChangeValue}
        trend={trend}
        label={label}
        key={itemKey + "sub"}
        defaultValue={defaultValue}
      />
      <InputError itemKey={itemKey} key={itemKey} />
    </div>
  );
};

export default NumberInputWithSortLabelDash;
