const InputLabel = ({label, require}) => {
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
        {label} {require && <span style={{color: "red"}}>*</span>}
    </span>
  )
}

export default InputLabel
