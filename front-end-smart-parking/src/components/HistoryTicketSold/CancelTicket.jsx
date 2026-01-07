import { useLoading } from "@/hook/loading"
import MessageReject from "../MessageReject"
import PopConfirmCustom from "../PopConfirmCustom"
import { cancelTicket } from "@/service/ticketPurchasedService";
import { getDataApi } from "@/utils/api";
import { toastError, toastSuccess } from "@/utils/toast";
import { setSearching } from "@/store/startSearchSlice";
import { useDispatch } from "react-redux";
import { isNullOrUndefined } from "@/utils/data";
import { useMessageError } from "@/hook/validate";
import { useEffect } from "react";

const CancelTicket = ({ data, handleClose }) => {
  const { showLoad, hideLoad } = useLoading();
  const { pushMessage, deleteKey, reset } = useMessageError();
  const dispatch = useDispatch();
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  
  const reasonCancel = {
    value: null
  }
  const handleOK = () => {
    if (isNullOrUndefined(reasonCancel.value) || reasonCancel.value === "") {
      pushMessage("reasonReject", "Lý do không được để trống");
      return;
    } else {
      deleteKey("reasonReject");
    }
    showLoad();
    cancelTicket({ id: data.id, reason: reasonCancel.value }).then(response => {
      toastSuccess("Huỷ vé thành công");
      dispatch(setSearching(true))
    })
      .catch(e => {
        const response = getDataApi(e);
        toastError(response.messsage);
      })
      .finally(() => {
        hideLoad();
        handleClose();  
      });
  }
  return (
    <PopConfirmCustom
      handleCancel={handleClose}
      handleOk={handleOK}
      title={"Xác nhận huỷ vé của khách hàng " + data.nguoiHuong}
      message={<MessageReject data={reasonCancel} message="Bạn sẽ phải chịu trách nhiệm nếu có kháng cáo liên quan" />}
      type={"warning"}
    />
  )
}

export default CancelTicket
