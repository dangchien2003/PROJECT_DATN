import { useSelector } from "react-redux";

const InputError = ({itemKey}) => {
  const fieldError = useSelector(state => state.fieldError);
  return (
    <div style={{fontSize: 12, padding: 4, color: "red"}}>{fieldError?.[itemKey]}</div>
  )
}

export default InputError
