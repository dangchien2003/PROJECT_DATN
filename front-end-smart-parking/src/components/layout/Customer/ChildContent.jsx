const ChildContent = ({children, backgroundColor = "#fff", className = ""}) => {
  return (<div className={"child-content " + className}  style={{
    backgroundColor: backgroundColor,
    borderColor: backgroundColor
  }}> 
    {children}
  </div>)
}

export default ChildContent