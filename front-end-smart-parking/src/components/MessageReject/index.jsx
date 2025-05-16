import { useState } from "react";
import InputError from "../InputError";
import { useMessageError } from "@/hook/validate";

const itemKey = "reasonReject"
const MessageReject = ({data, message = "Yêu cầu sẽ chuyển sang trạng thái bị từ chối"}) => {
  const [value, setValue] = useState("");
  const {pushMessage, deleteKey} = useMessageError();
  const handleChange = (e) => {
    const newValue = e.target.value;
    if(newValue === "" || newValue === null) {
      pushMessage(itemKey, "Vui lòng nhập lý do từ chối")
    }else {
      deleteKey(itemKey)
    }
    if(newValue.length > 255) {
      return
    }
    setValue(newValue);
    data.value = newValue;
  }
  return (
    <div>
      <div>{message}</div>
      <div style={{ fontStyle: "italic", color: "black" }}>Lý do từ chối</div>
      <textarea style={{ width: 300, height: 100, fontSize: 14, padding: 4 }} onChange={handleChange} value={value}></textarea>
      <InputError itemKey={itemKey} key={itemKey}/>
    </div>
  )
}

export default MessageReject
