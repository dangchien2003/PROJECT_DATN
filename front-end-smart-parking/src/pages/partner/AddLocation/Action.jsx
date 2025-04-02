import PopConfirmCustom from "@/components/PopConfirmCustom";
import { useLoading } from "@/hook/loading";
import { Button } from "antd";
import { useState } from "react";

const Action = ({isModify}) => {
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false);
  const [messagePopup, setMessagePopup] = useState("");
  const [titlePopup, setTitlePopup] = useState("");
  const [typePopup, setTypePopup] = useState("warning");
  const {showLoad, hideLoad} = useLoading();

  const handleConfirmAction = (actionType) => {
    switch(actionType) {
      case 1:
        setTypePopup("warning");
        setTitlePopup("Bạn có chắc chắn tiếp tục gửi yêu cầu thêm mới địa điểm EAON MALL hà đông không?");
        setMessagePopup("Yêu cầu sẽ được gửi tới quản trị viên kiểm duyệt");
        break;
      case 2:
        setTypePopup("warning");
        setTitlePopup("Bạn có chắc chắn tiếp tục gửi yêu cầu chỉnh sửa địa điểm EAON MALL hà đông không?");
        setMessagePopup("Yêu cầu sẽ được gửi tới quản trị viên kiểm duyệt");
        break;
      default: return;
    }
    setOpenPopupConfirm(true)
  }

  const handleCancel= ()=> {
    setOpenPopupConfirm(false)
  }
  const handleOk= ()=> {
    setOpenPopupConfirm(false)
    showLoad("Đang xử lý");
    setTimeout(()=> {
      hideLoad();
    }, 3000)
  }
  return (
    <div>
        <div style={{display: "flex", gap: 20, justifyContent: "center", margin: "64px 200px", borderTop: "1px solid #B9B7B7", paddingTop: 16}}>
        {isModify ? <Button color="cyan" variant="solid" onClick={()=> {handleConfirmAction(2)}}>Gửi yêu cầu chỉnh sửa</Button> : <Button color="cyan" variant="solid"  onClick={()=> {handleConfirmAction(1)}}>Gửi yêu cầu thêm mới</Button>}
      </div>
       {openPopupConfirm && <PopConfirmCustom type={typePopup} title={titlePopup} message={messagePopup} handleCancel={handleCancel} handleOk={handleOk} />}
    </div>
  )
}

export default Action
