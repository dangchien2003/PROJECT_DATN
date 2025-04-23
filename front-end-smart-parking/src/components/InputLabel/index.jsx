import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const InputLabel = ({itemKey, label, require}) => {
  const requireKeys = useSelector(state => state.requireField);
  const [requireField, setRequireField] = useState(false)

  useEffect(()=> {
    if(Array.isArray(requireKeys) && itemKey) {
      setRequireField(requireKeys.includes(itemKey))
    }
  }, [requireKeys, itemKey])
  return (
    <span
        className="truncated-text"
        style={{
          position: "absolute",
          display: "inline-block",
          padding: "3px 5px",
          top: -14,
          left: 8,
          maxWidth: 240,
          fontSize: 14,
          background: "white",
          zIndex: 100,
        }}
      >
        {label} {(require || requireField) && <span style={{color: "red"}}>*</span>}
    </span>
  )
}

export default InputLabel
