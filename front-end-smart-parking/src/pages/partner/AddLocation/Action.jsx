import PopConfirmCustom from "@/components/PopConfirmCustom";
import { useLoading } from "@/hook/loading";
import { useMessageError } from "@/hook/validate";
import { modifyLocation } from "@/service/locationService";
import { getDataApi } from "@/utils/api";
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
      setTitlePopup("Bạn có chắc chắn tiếp tục gửi yêu cầu chỉnh sửa địa điểm EAON MALL hà đông không?");
      setMessagePopup("Yêu cầu sẽ được gửi tới quản trị viên kiểm duyệt");
    } else {
      setTypePopup("warning");
      setTitlePopup("Bạn có chắc chắn tiếp tục gửi yêu cầu thêm mới địa điểm EAON MALL hà đông không?");
      setMessagePopup("Yêu cầu sẽ được gửi tới quản trị viên kiểm duyệt");
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
    console.log(data)
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
    // convert data boolean
    data.urgentApprovalRequest = data.urgentApprovalRequest ? 1 : 0;
    data.openHoliday = data.openHoliday ? 1 : 0;
    // call
    modifyLocation(data)
      .then((response) => {
        toastSuccess("Đã gửi yêu cầu " + (data.locationId ? "thêm" : "chỉnh sửa") + " địa điểm thành công")
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
