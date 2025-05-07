import { useState } from 'react'
import CountDown from '../CountDown';
import { Tooltip } from 'antd';
import { MdDelete } from 'react-icons/md';
import dayjs from "dayjs"
import PopConfirmCustom from '../PopConfirmCustom';
import { useLoading } from '@/hook/loading';
import { partnerCancelRelease } from '@/service/ticketService';
import { getDataApi } from '@/utils/api';
import { toastError, toastSuccess } from '@/utils/toast';
import { setSearching } from '@/store/startSearchSlice';
import { useDispatch } from 'react-redux';

const Action = ({ data }) => {
  const [showPopCancel, setShowPopCancel] = useState(false);
  const {showLoad, hideLoad} = useLoading();
  const dispatch = useDispatch();

  const handleClickCancelRelease = (event, id) => {
    event.stopPropagation();
    if(!id) return; // không hành động nếu id null
    setShowPopCancel(true)
  }

  const handleCloseCancelRelease = (event) => {
    event.stopPropagation();
    setShowPopCancel(false)
  }

  const handleAllowCancelRelease = (event) => {
    event.stopPropagation();
    const dataApi = {
      id: data.id, 
      approve: false,
    }
    showLoad("Đang xử lý")
    partnerCancelRelease(dataApi)
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
        <span className="button-cancel" onClick={(e) => { handleClickCancelRelease(e, data.id) }}>
          <Tooltip title="Huỷ phát hành" >
            <MdDelete style={{ fontSize: 21, cursor: 'pointer' }} />
          </Tooltip>
        </span>
        <CountDown start={dayjs()} end={data.timeAppliedEdit} />
        {showPopCancel && <PopConfirmCustom title={`Bạn có muốn tiếp tục huỷ phát hành vé ${data.name} của đối tác ${data.partnerName} không?`} message={"Vé sẽ không được phát hành theo lịch đã đặt"} handleCancel={(e) => {handleCloseCancelRelease(e)}} handleOk={(e) => {handleAllowCancelRelease(e)}} />}
      </div>
    )
  } else {
    return (
      <div>
        <span onClick={(e) => { handleClickCancelRelease(e, null) }}>
          <Tooltip title="Huỷ phát hành" >
            <MdDelete style={{ color: "#b9b7b7", fontSize: 21, cursor: 'pointer' }} />
          </Tooltip>
        </span>
      </div>
    )
  }
}

export default Action
