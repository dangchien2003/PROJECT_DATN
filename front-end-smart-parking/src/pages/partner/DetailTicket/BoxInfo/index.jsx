import BoxCheckBox from "@/components/BoxCheckBox"
import BoxTextField from "@/components/BoxTextField"
import { TICKET_STATUS, VEHICLE } from "@/utils/constants"
import { formatTimestamp } from "@/utils/time"
import OtherInfoModify from "./OtherInfoModify"
import { Button} from "antd"
import { MdOutlineCancel } from "react-icons/md"
import { formatCurrency } from "@/utils/number"
import { Typography } from "antd";
import { useEffect, useState } from "react"
import { useLoading } from "@/hook/loading"
import PopConfirmCustom from "@/components/PopConfirmCustom"
import { convertObjectToDataSelectBox } from "@/utils/object"
import BoxTextArea from "@/components/BoxTextArea"
import { checkExistWaitRelease, partnerCancelRelease } from "@/service/ticketService"
import { toastError, toastSuccess } from "@/utils/toast"
import { getDataApi } from "@/utils/api"
import { isNullOrUndefined } from "@/utils/data"
import { FaEdit } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import LocationUseTicket from "@/components/LocationUseTicket"
const { Title } = Typography;

const BoxPrice = ({ checked, price, label }) => {
  return <div style={{ display: "flex", flexWrap: "wrap" }}>
    <BoxCheckBox label={label} checked={checked} />
    {checked && <BoxTextField label={"Giá bán"} value={`${formatCurrency(price)} đ`} disabled={true} hideLabel={true} />}
  </div>
}

const ticketStatus = convertObjectToDataSelectBox(TICKET_STATUS)

const BoxInfo = ({ data, isWaitRelease, widthPage, existWaitReleaseInput }) => {
  const [styleParent, setStyleParent] = useState({})
  const [action, setAction] = useState(null);
  const [canceled, setCanceled] = useState(false);
  const [existWaitRelease, setExistWaitRelease] = useState(true);
  const { showLoad, hideLoad } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    // kiểm tra tồn tại chờ áp dụng
    if (!isNullOrUndefined(data) && !existWaitReleaseInput) {
      checkExistWaitRelease(data?.ticketId).then(() => {
        setExistWaitRelease(false);
      })
        .catch((error) => {
          const dataError = getDataApi(error);
          // báo lỗi nếu không phải conflict
          if (dataError?.code !== 1002) {
            toastError(dataError?.message);
          }
          setExistWaitRelease(true);
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [data])


  useEffect(() => {
    let style = {};
    if (isWaitRelease) {
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
  }, [isWaitRelease, widthPage]);

  const resetAction = () => {
    setAction(null);
  }

  const handleAllowReject = () => {
    const dataApi = {
      id: data.id,
      approve: false
    }
    showLoad("Đang xử lý")
    partnerCancelRelease(dataApi)
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

  const handleConfirm = (action) => {
    setAction(action);
  }

  const handleClickEdit = () => {
    navigate(`/partner/ticket/edit/${data.ticketId}`)
  }

  const getMessagePopup = (action) => {
    if (isWaitRelease) {
      if (action === 1) {
        return {
          title: `Bạn có chắc chắn từ chối phát hành vé ${data.name} không?`,
          message: 'Vé sẽ không được phát hành theo lịch đã đặt'
        }
      }
    } else {
      if (action === 2) {
        return {
          title: `Bạn có chắc chắn chỉnh sửa vé ${data.name} không?`,
          message: "Vé sẽ được phát hành theo lịch đã đặt"
        }
      }
    }
    return {}
  }

  return (
    <div>
      {data !== null && <div style={styleParent} >
        <Title style={{ padding: "0 8px" }} level={5}>{isWaitRelease ? "Thông tin chỉnh sửa" : "Thông tin gốc"}</Title>
        {/* Thông tin chính */}
        <div className="box-ticket-detail">
          <BoxTextField label="Tên vé" value={data?.name} disabled={true} colorGray={false} key={"tv"} />
          <BoxTextField label="Lần chỉnh sửa" value={data?.modifyCount} disabled={true} colorGray={false} key={"lcs"} />
          <BoxTextField label="Thời gian phát hành" value={formatTimestamp(data?.releasedTime, "DD/MM/YYYY HH:mm")} disabled={true} colorGray={false} key={"tgph"} />
          <BoxTextField label="Phương tiện sử dụng" value={VEHICLE[data?.vehicle] ? VEHICLE[data?.vehicle].name : null} disabled={true} colorGray={false} key={"ptsd"} />
          <BoxTextField label="Trạng thái" value={ticketStatus[data?.status].label} disabled={true} colorGray={false} key={"tt"} />
          <BoxTextField label="Lý do thay đổi trạng thái" value={data?.reason} disabled={true} colorGray={false} key={"ldtđtt"} />
          <BoxTextArea label={"Quyền lợi"} value={data.description} rows={5} disabled={true} />
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
        {isWaitRelease &&
          <div>
            <OtherInfoModify data={data} />
            <div style={{ display: "flex", justifyContent: "center", padding: "0 16px" }}>
              {(data?.released === 0 && !data?.isDel && !canceled) && <Button color="danger" variant="outlined" style={{ margin: "0 8px" }} onClick={() => { handleConfirm(1) }}>
                <MdOutlineCancel />
                Huỷ áp dụng
              </Button>}
            </div>
          </div>}
        {!existWaitRelease &&
          <div>
            <div style={{ display: "flex", justifyContent: "center", padding: "0 16px" }}>
              <Button color="primary" variant="solid" style={{ margin: "0 8px" }} onClick={handleClickEdit}>
                <FaEdit />
                Chỉnh sửa
              </Button>
            </div>
          </div>}
      </div>}
      <div>
        {action === 1 && <PopConfirmCustom type="warning" {...getMessagePopup(1)} handleOk={handleAllowReject} handleCancel={resetAction} key={"approve"} />}
      </div>
    </div>
  )
}

export default BoxInfo
