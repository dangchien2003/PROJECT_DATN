import PopConfirmCustom from "@/components/PopConfirmCustom"
import { Button } from "antd"
import { useState } from "react";

const CardAction = ({isWaitApprove}) => {
  const [openPopupConfirm, setOpenPopupConfirm] = useState(false);
  const [messagePopup, setMessagePopup] = useState("");
  const [titlePopup, setTitlePopup] = useState("");
  const [typePopup, setTypePopup] = useState("warning");
  
  const handleConfirmAction = (actionType) => {
    switch(actionType) {
      case 1:
        setTypePopup("warning");
        setTitlePopup("Bạn có chắc chắn muốn cấp thẻ cho Lê Đăng Chiến không?");
        setMessagePopup("Thẻ sẽ được đưa vào danh sách chờ cấp.");
        break;
      case 3:
        setTypePopup("warning");
        setTitlePopup("Bạn có chắc chắn muốn mở khoá thẻ 012345678900 không?");
        setMessagePopup("Hành động này sẽ mở khoá thẻ của người dùng.");
        break;
      case 4: 
        setTypePopup("warning");
        setTitlePopup("Bạn có chắc chắn muốn tạm khoá thẻ 012345678900 không?");
        setMessagePopup("Hành động này sẽ ngăn chặn việc sử dụng dịch vụ của khách hàng.");
        break;
      case 5:
        setTypePopup("warning");
        setTitlePopup("Bạn có chắc chắn muốn khoá vĩnh viễn thẻ 012345678900 không?");
        setMessagePopup("Hành động này sẽ khiến thẻ không thể hoạt động trở lại.");
        break;
      case 6:
        setTypePopup("warning");
        setTitlePopup("Bạn có chắc chắn muốn từ chối yêu cầu cấp thẻ cho Lê Đăng Chiến Không?");
        setMessagePopup("");
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
  }
  return (
    <div>
      <div className={isWaitApprove ? "wrap container-action jcc" : "wrap container-action"}>
        {isWaitApprove 
        ? <>
            <Button color="primary" variant="outlined" onClick={()=> { handleConfirmAction(1)}}>Duyệt</Button>
            <Button color="danger" variant="outlined" onClick={()=> { handleConfirmAction(6)}}>Từ chối</Button>
          </>
        : <>
            <Button color="primary" variant="outlined" onClick={()=> {
            handleConfirmAction(4)
            }}>Tạm khoá</Button>
            <Button color="danger" variant="outlined" onClick={()=> {
              handleConfirmAction(5)
            }}>Khoá vĩnh viễn</Button>
            <Button color="cyan" variant="outlined" onClick={()=> {
              handleConfirmAction(3)
            }}>Mở khoá</Button>
        </>
      }
      </div>
       {openPopupConfirm && <PopConfirmCustom type={typePopup} title={titlePopup} message={messagePopup} handleCancel={handleCancel} handleOk={handleOk} />}
    </div>
  )
}

export default CardAction
