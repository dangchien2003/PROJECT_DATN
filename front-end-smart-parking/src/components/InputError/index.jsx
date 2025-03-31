
const InputError = ({dataError, itemKey}) => {
  return (
    <div style={{fontSize: 12, padding: 4, color: "red"}}>{dataError?.[itemKey]}</div>
  )
}

export default InputError
