import { useState } from 'react'
import CountDown from '../CountDown';
import { Tooltip } from 'antd';
import { MdDelete } from 'react-icons/md';
import dayjs from "dayjs"
import PopConfirmCustom from '../PopConfirmCustom';
import { useLoading } from '@/hook/loading';
import { adminCancelRelease } from '@/service/ticketService';
import { getDataApi } from '@/utils/api';
import { toastError, toastSuccess } from '@/utils/toast';
import { setSearching } from '@/store/startSearchSlice';
import { useDispatch } from 'react-redux';
import MessageReject from '../MessageReject';
import { useMessageError } from '@/hook/validate';
import { FaEye } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const Action = ({ data }) => {
  const navigate = useNavigate()
  const [showPopCancel, setShowPopCancel] = useState(false);
  const { pushMessage, deleteKey } = useMessageError();
  const [reasonReject] = useState({
    value: null
  })
  const {showLoad, hideLoad} = useLoading();
  const dispatch = useDispatch();

  const handleClickShowDetail = () => {
    navigate(`/ticket/detail/${data.isDel ? 1 : 0}/${data.tab}/${data.id}`)
  }
  const buttonDetail = (<span onClick={handleClickShowDetail}>
          <Tooltip title="Xem" >
            <FaEye style={{ fontSize: 21, cursor: 'pointer' }} />
          </Tooltip>
        </span>)

  const handleClickCancelRelease = () => {
    setShowPopCancel(true)
  }

  const handleCloseCancelRelease = () => {
    deleteKey("reasonReject");
    setShowPopCancel(false);
    // reset lý do
    reasonReject.value = null;
  }

  const handleAllowCancelRelease = () => {
    const dataApi = {
      id: data.id, 
      approve: false,
      reason: reasonReject.value,
    }
    // không thực thi khi không có lý do
    if (!reasonReject.value || reasonReject.value === "") {
      pushMessage("reasonReject", "Vui lòng nhập lý do từ chối")
      return
    }
    showLoad("Đang xử lý")
    adminCancelRelease(dataApi)
    .then((response) => {
      toastSuccess("Huỷ phát hành thành công")
      // load lại
      dispatch(setSearching(true))
    })
    .catch((e) => {
      const error = getDataApi(e);
      toastError(error.message)
    })
    .finally(() => {
      hideLoad();
      setShowPopCancel(false)
    })
  }

  if (dayjs().isBefore(dayjs(data.timeAppliedEdit)) && !data.isDel && data.released === 0) {
    return (
      <div>
        {buttonDetail}
        <span className="button-cancel" onClick={handleClickCancelRelease}>
          <Tooltip title="Huỷ phát hành" >
            <MdDelete style={{ fontSize: 21, cursor: 'pointer' }} />
          </Tooltip>
        </span>
        <CountDown start={dayjs()} end={data.timeAppliedEdit} />
        {showPopCancel && <PopConfirmCustom title={`Bạn có muốn tiếp tục huỷ phát hành vé ${data.name} của đối tác ${data.partnerName} không?`} message={<MessageReject key={"MessageReject"} data={reasonReject} message='Vé sẽ không được phát hành theo lịch đã đặt'/>}   handleCancel={handleCloseCancelRelease} handleOk={handleAllowCancelRelease} />}
      </div>
    )
  } else {
    return (
      <div style={{display: "flex", gap: 16, justifyContent: 'center'}}>
        {buttonDetail}
        {(data.isDel === false) && <span onClick={handleClickCancelRelease}>
          <Tooltip title="Huỷ phát hành" >
            <MdDelete style={{ color: "#b9b7b7", fontSize: 21, cursor: 'pointer' }} />
          </Tooltip>
        </span>}
      </div>
    )
  }
}

export default Action
