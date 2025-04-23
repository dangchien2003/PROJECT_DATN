import PopConfirmCustom from "@/components/PopConfirmCustom";
import { useLoading } from "@/hook/loading";
import { useMessageError } from "@/hook/validate";
import { modifyTicket } from "@/service/ticketService";
import { getDataApi } from "@/utils/api";
import { formatTimestamp } from "@/utils/time";
import { toastError, toastSuccess } from "@/utils/toast";
import { checkRequireInput, validateInput } from "@/utils/validateAction";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Action = ({isModify, data, requireKeys, indexKey}) => {
  const fieldError = useSelector(state => state.fieldError);
  const {pushMessage} = useMessageError();
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false);
  const [messagePopup, setMessagePopup] = useState("");
  const [titlePopup, setTitlePopup] = useState("");
  const [typePopup, setTypePopup] = useState("warning");
  const [clickCreate, setClickCreate] = useState(false);
  const {showLoad, hideLoad} = useLoading();
  const dispatch = useDispatch();

  const handleConfirmAction = () => {
    if(isModify) {
      setTypePopup("warning");
      setTitlePopup(`Bạn có chắc chắn tiếp tục lưu thông tin chỉnh sửa của vé ${data?.name} không?`);
      setMessagePopup(`Thông tin sẽ được tự động áp dụng vào lúc ${formatTimestamp(data?.timeAppliedEdit, "DD/MM/YYYY HH:mm")}`);
    } else {
      setTypePopup("warning");
      setTitlePopup(`Bạn có chắc chắn tiếp tục gửi yêu cầu tạo vé ${data?.name} không?`);
      setMessagePopup(`Thông tin sẽ được tự động áp dụng vào lúc ${formatTimestamp(data?.timeAppliedEdit, "DD/MM/YYYY HH:mm")}`);
    }
    setOpenPopupConfirm(true)
  }

  useEffect(() => {
    if(clickCreate) {
      setClickCreate(false)
      if(!validateInput(fieldError, indexKey, dispatch)) {
        return
      }
      handleConfirmAction()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickCreate])

  const handleClickAction = () => {
    // valid data
    checkRequireInput(data, fieldError, pushMessage, requireKeys);
    setClickCreate(true)
  }

  const handleCancel= ()=> {
    setOpenPopupConfirm(false)
  }
  const handleOk= ()=> {
    setOpenPopupConfirm(false)
    showLoad("Đang xử lý");
    // call
    modifyTicket(data)
      .then((response) => {
        toastSuccess("Đã gửi yêu cầu " + (data.ticketId ? "chỉnh sửa": "thêm") + " vé thành công")
      })
      .catch((error) => {
        const result = getDataApi(error);
        toastError(result.message)
      })
      .finally(()=> {
        hideLoad()
      })
  }
  return (
    <div>
        <div style={{display: "flex", gap: 20, justifyContent: "center", margin: "64px 200px", borderTop: "1px solid #B9B7B7", paddingTop: 16}}>
        {isModify ? <Button color="cyan" variant="solid" onClick={handleClickAction}>Gửi yêu cầu chỉnh sửa</Button> : <Button color="cyan" variant="solid"  onClick={handleClickAction}>Gửi yêu cầu thêm mới</Button>}
      </div>
       {openPopupConfirm && <PopConfirmCustom type={typePopup} title={titlePopup} message={messagePopup} handleCancel={handleCancel} handleOk={handleOk} />}
    </div>
  )
}

export default Action
