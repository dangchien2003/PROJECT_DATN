import BoxCheckBox from "@/components/BoxCheckBox"
import BoxTextField from "@/components/BoxTextField"
import { TICKET_STATUS, VEHICLE } from "@/utils/constants"
import { formatTimestamp } from "@/utils/time"
import OtherInfoModify from "./OtherInfoModify"
import { Button } from "antd"
import { MdOutlineCancel } from "react-icons/md"
import { formatCurrency } from "@/utils/number"
import { Typography } from "antd";
import { useEffect, useState } from "react"
import { useLoading } from "@/hook/loading"
import PopConfirmCustom from "@/components/PopConfirmCustom"
import { convertObjectToDataSelectBox } from "@/utils/object"
import BoxTextArea from "@/components/BoxTextArea"
import MessageReject from "@/components/MessageReject"
import { adminCancelRelease } from "@/service/ticketService"
import { toastError, toastSuccess } from "@/utils/toast"
import { useMessageError } from "@/hook/validate"
import { getDataApi } from "@/utils/api"
import LocationUseTicket from "@/components/LocationUseTicket"
const { Title } = Typography;

const BoxPrice = ({checked, price, label})=> {
  return <div style={{display: "flex", flexWrap: "wrap"}}>
    <BoxCheckBox label={label} checked={checked}/>
    {checked && <BoxTextField label={"Giá bán"} value={`${formatCurrency(price)} đ`} disabled={true} hideLabel={true}/>}
  </div>
}

const ticketStatus = convertObjectToDataSelectBox(TICKET_STATUS)

const BoxInfo = ({data, isWaitApprove, widthPage}) => {
  const [styleParent, setStyleParent] = useState({})
  const [action, setAction] = useState(null);
  const [canceled, setCanceled] = useState(false);
  const {showLoad, hideLoad} = useLoading();
  const { pushMessage, deleteKey } = useMessageError();
  const [reasonReject] = useState({
    value: null
  })

  useEffect(() => {
    let style = {};
    if (isWaitApprove) {
      if (widthPage <= 1288) {
        style = {
          borderTop: "1px solid rgb(185, 183, 183)",
          paddingTop: 8,
          marginTop: 104
        }
      } else {
        style = {
          borderLeft: "1px solid rgb(185, 183, 183)"
        }
      }
    }

    setStyleParent(style)
  }, [isWaitApprove, widthPage]);

  const resetAction = () => {
    setAction(null);
    deleteKey("reasonReject");
    // reset lý do
    reasonReject.value = null;
  }

  const handleAllowReject = () => {
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
          toastSuccess("Huỷ phát hành thành công");
          setCanceled(true);
        })
        .catch((e) => {
          const error = getDataApi(e);
          toastError(error.message)
        })
        .finally(() => {
          hideLoad();
          resetAction();
        })
  }

  const handleConfirm = (event, action) => {
    setAction(action);
    event.stopPropagation();
  }

  const getMessagePopup = (action) => {
    if(isWaitApprove) {
      if(action === 1) {
        return {
          title: `Bạn có chắc chắn từ chối phát hành vé ${data.name} không?`, 
          message: <MessageReject key={"MessageReject"} data={reasonReject} message='Vé sẽ không được phát hành theo lịch đã đặt'/>
        }
      }
    }
    return {}
  }

  return (
    <div>
      {data !== null && <div style={styleParent} >
        <Title style={{padding: "0 8px"}} level={5}>{isWaitApprove ? "Thông tin chỉnh sửa" : "Thông tin gốc"}</Title>
        {/* Thông tin chính */}
        <div className="box-ticket-detail">
        <BoxTextField label="Tên vé" value={data?.name} disabled={true} colorGray={false} key={"tv"}/>
        <BoxTextField label="Lần chỉnh sửa" value={data?.modifyCount} disabled={true} colorGray={false} key={"lcs"}/>
        <BoxTextField label="Thời gian phát hành" value={formatTimestamp(data?.releasedTime, "DD/MM/YYYY HH:mm")} disabled={true} colorGray={false} key={"tgph"}/>
        <BoxTextField label="Phương tiện sử dụng" value={VEHICLE[data?.vehicle] ? VEHICLE[data?.vehicle].name : null} disabled={true} colorGray={false} key={"ptsd"}/>
        <BoxTextField label="Trạng thái" value={ticketStatus[data?.status].label} disabled={true} colorGray={false} key={"tt"}/>
        <BoxTextField label="Lý do thay đổi trạng thái" value={data?.reason} disabled={true} colorGray={false} key={"ldtdtt"}/>
        <BoxTextArea label={"Quyền lợi"} value={data.description} rows={5} disabled={true} key={"ql"}/>
      </div>
        {/* price */}
        <div>
          <BoxPrice label="Mở bán theo giờ" checked={data?.timeSlot} price={data?.price?.time?.price} />
          <BoxPrice label="Mở bán theo ngày" checked={data?.daySlot} price={data?.price?.day?.price} />
          <BoxPrice label="Mở bán theo tuần" checked={data?.weekSlot} price={data?.price?.week?.price} />
          <BoxPrice label="Mở bán theo tháng" checked={data?.monthSlot} price={data?.price?.month?.price} />
          </div>
        {/* địa điểm áp dụng */}
        <LocationUseTicket ids={data.locationUse}/>
        {isWaitApprove && 
        <div>
          <OtherInfoModify data={data} />
          <div style={{ display: "flex", justifyContent: "center", padding: "0 16px" }}>
          {(data?.released === 0 && !data?.isDel && !canceled) && <Button color="danger" variant="outlined" style={{margin: "0 8px"}} onClick={(event)=> {handleConfirm(event, 1)}}>
            <MdOutlineCancel />
            Từ chối
          </Button>}
          <div>
            {action === 1 && <PopConfirmCustom type="warning" {...getMessagePopup(1)} handleOk={handleAllowReject} handleCancel={resetAction} key={"approve"}/>}
          </div>
        </div>
        </div> }
      </div>}
    </div>
  )
}

export default BoxInfo
