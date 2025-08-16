import MessageReject from "@/components/MessageReject";
import PopConfirmCustom from "@/components/PopConfirmCustom"
import { useLoading } from "@/hook/loading";
import { approveRequest, rejectRequest } from "@/service/cardService";
import { getDataApi } from "@/utils/api";
import { toastError, toastSuccess } from "@/utils/toast";
import { Button } from "antd"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CardAction = ({ isWaitApprove, data }) => {
  const navigate = useNavigate();
  const [actionType, setActionType] = useState("");
  const { showLoad, hideLoad } = useLoading();
  const reasonReject = {
    value: null
  }
  
  const handleCancel = () => {
    setActionType(null)
  }
  const handleOk = () => {
    if (actionType === 1) {
      handleAllowApprove();
    } else if (actionType === 6) {
      handleAllowReject();
    }
  }

  const handleAllowApprove = () => {
    showLoad("Đang xử lý");
    approveRequest(data.id).then(() => {
      toastSuccess("Phê duyệt thành công");
      navigate("/admin/card/wait-approve");
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(() => {
      hideLoad();
    })
  }

  const handleAllowReject = () => {
    if (reasonReject.value === null
      || reasonReject.value?.trim().length === 0) {
      return;
    }
    showLoad("Đang xử lý");
    rejectRequest(data.id, reasonReject.value).then(() => {
      toastSuccess("Từ chối thành công");
      navigate("/admin/card/wait-approve");
    }).catch(e => {
      const response = getDataApi(e);
      toastError(response.message);
    }).finally(() => {
      hideLoad();
      reasonReject.value = null;
    })
  }

  return (
    <div>
      <div className={isWaitApprove ? "wrap container-action" : "wrap container-action"}>
        {isWaitApprove
          ? <>
            <Button color="primary" variant="outlined" onClick={() => { setActionType(1) }}>Duyệt</Button>
            <Button color="danger" variant="outlined" onClick={() => { setActionType(6) }}>Từ chối</Button>
          </>
          : <>
            {/* <Button color="primary" variant="outlined" onClick={()=> {
            handleConfirmAction(4)
            }}>Tạm khoá</Button>
            <Button color="danger" variant="outlined" onClick={()=> {
              handleConfirmAction(5)
            }}>Khoá vĩnh viễn</Button>
            <Button color="cyan" variant="outlined" onClick={()=> {
              handleConfirmAction(3)
            }}>Mở khoá</Button> */}
          </>
        }
      </div>
      {actionType === 1 && <PopConfirmCustom type={"warning"} title={`Bạn có chắc chắn việc tiếp tục cấp thẻ cho ${data.owner} không?`} message={"Yêu cầu sẽ được chuyển sang trạng thái chờ cấp"} handleCancel={handleCancel} handleOk={handleOk} />}
      {actionType === 6 && <PopConfirmCustom type={"warning"} title={`Bạn có chắc chắn việc từ chối cấp thẻ cho ${data.owner} không?`} message={<MessageReject message={"Yêu cầu sẽ được chuyển sang trạng thái bị từ chối"} data={reasonReject} />} handleCancel={handleCancel} handleOk={handleOk} />}
    </div>
  )
}

export default CardAction
