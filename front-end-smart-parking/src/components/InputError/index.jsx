import { useSelector } from "react-redux";

const InputError = ({itemKey, isAuthen}) => {
  const fieldError = useSelector(state => state.fieldError);
  return (
    <div className={isAuthen ? "authen-error-field" : "error-field"} style={{fontSize: 12, padding: 4, color: "red"}}>{fieldError?.[itemKey]}</div>
  )
}

export default InputError
