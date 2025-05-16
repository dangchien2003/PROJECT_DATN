import BoxCheckBox from "@/components/BoxCheckBox"
import BoxTextField from "@/components/BoxTextField"
import { LOCATION_STATUS } from "@/utils/constants"
import { formatTimestamp } from "@/utils/time"
import OtherInfoModify from "./OtherInfoModify"
import { FaCheck } from "react-icons/fa6"
import { Button } from "antd"
import { MdOutlineCancel } from "react-icons/md"
import { Typography } from "antd";
import QuillEditor from "@/components/QuillEditor"
import { useEffect, useState } from "react"
import { useLoading } from "@/hook/loading"
import PopConfirmCustom from "@/components/PopConfirmCustom"
import Avatar from "@/components/Avatar"
import { extractYouTubeVideoId } from "@/utils/extract"
import BoxTextArea from "@/components/BoxTextArea"
import { useMessageError } from "@/hook/validate"
import MessageReject from "@/components/MessageReject"
import { toastError, toastSuccess } from "@/utils/toast"
import { getDataApi } from "@/utils/api"
import { approve } from "@/service/locationService"
const { Title } = Typography;

const linkImage = "https://i0.wp.com/plopdo.com/wp-content/uploads/2021/11/feature-pic.jpg?w=537&ssl=1"
const resonReject = {
  value: null
};
const BoxInfo = ({ data, isModify, widthPage, tab }) => {
  const [styleParent, setStyleParent] = useState({})
  const [action, setAction] = useState(null);
  const [showAction, setShowAction] = useState(false);
  const { showLoad, hideLoad } = useLoading();
  const { pushMessage, deleteKey } = useMessageError();

  useEffect(() => {
    // tắt action nếu là tab từ chối
    if(tab === 5) {
      setShowAction(true);
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let style = {};
    if (isModify) {
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
  }, [isModify, widthPage]);

  const resetAction = () => {
    setAction(null);
  }

  const handleAllowApprove = () => {
    const payload = {
      id: data.modifyId,
      approve: true,
    }
    showLoad("Đang xử lý");
    processAction(payload);
  }

  const handleCancelApprove = () => {
    resetAction();
  }

  const handleAllowReject = () => {
    const payload = {
      id: data.modifyId,
      approve: false,
      reason: resonReject.value,
    };
    // không thực thi khi không có lý do
    if (!resonReject.value || resonReject.value === "") {
      pushMessage("reasonReject", "Vui lòng nhập lý do từ chối")
      return
    }
    showLoad("Đang xử lý");
    processAction(payload);
  }

  const processAction = (payload) => {
    approve(payload)
      .then(() => {
        setShowAction(true);
        toastSuccess((payload.approve ? "Phê duyệt" : "Từ chối") + " thành công")
      })
      .catch((error) => {
        const dataError = getDataApi(error);
        toastError(dataError.message)
      })
      .finally(() => {
        hideLoad();
        resetAction();
        resonReject.value = null;
      })
  }

  const handleCancelReject = () => {
    deleteKey("reasonReject")
    resetAction();
  }

  const handleConfirm = (event, action, data) => {
    setAction(action);
    event.stopPropagation();
  }

  const getMessagePopup = (action) => {
    if (tab === 3) {
      if (action === 1) {
        return {
          title: `Bạn có chắc chắn đồng ý việc thêm địa điểm "${data.name}" không?`,
          message: "Địa điểm sẽ đi vào hoạt động vào " + formatTimestamp(data.timeAppliedEdit, "DD/MM/YYYY HH:mm")
        }
      } else if (action === 2) {
        return {
          title: `Bạn có chắc chắn từ chối việc thêm địa điểm "${data.name}" không?`,
          message: <MessageReject key={"MessageReject"} data={resonReject} />
        }
      }
    } else if (tab === 4) {
      if (action === 1) {
        return {
          title: `Bạn có chắc chắn đồng ý việc sửa thông tin địa điểm "${data.name}" không?`,
          message: "Thông tin chỉnh sửa sẽ được áp dụng vào " + formatTimestamp(data.timeAppliedEdit, "DD/MM/YYYY HH:mm")
        }
      } else if (action === 2) {
        return {
          title: `Bạn có chắc chắn từ chối việc sửa thông tin địa điểm "${data.name}" không?`,
          message: <MessageReject key={"MessageReject"} data={resonReject} />
        }
      }
    }

    return {}
  }

  return (
    <div>
      {data !== null && <div style={styleParent}>
        <Title style={{ padding: "0 8px" }} level={5}>{isModify ? (data.modifyStatus === 1 ? "Thông tin bị từ chối" : "Thông tin chỉnh sửa") : "Thông tin gốc"}</Title>
        {/* Thông tin chính */}
        <div style={{ display: "flex", gap: 8, padding: "0 16px" }}>
          <div>
            <Avatar linkImage={linkImage} />
            <Title level={5} style={{ textAlign: "center" }}>Ảnh đại diện</Title>
          </div>
          <div style={{ flex: 1 }}>
            {data.videoTutorial != null ?
              <div style={{ width: "100%" }}>
                <iframe width={"100%"} height={210} src={`https://www.youtube.com/embed/${extractYouTubeVideoId(data.videoTutorial)}?si=OAXSDfqe1vpf02LQ`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" ></iframe>
                <Title level={5} style={{ textAlign: "center" }}>Video giới thiệu</Title>
              </div>
              : <div>
                <div style={{ height: 210, display: "flex", alignItems: "center", justifyContent: "center" }}>Không tìm thấy video giới thiệu</div>
                <Title level={5} style={{ textAlign: "center" }}>Video giới thiệu</Title>
              </div>}
          </div>
        </div>
        <div className="box-ticket-detail">
          {isModify && data.modifyStatus === 1 && <div style={{ width: "100%" }}>
            <BoxTextArea label={"Lý do từ chối"} value={data?.reasonReject} rows={5} disabled={true} />
          </div>}
          <BoxTextField label="Tên địa điểm" value={data.name} disabled={true} colorGray={false} key={"tdd"} />
          <BoxTextField label={<span>Toạ độ {data.linkGoogleMap && <a href={data.linkGoogleMap} target="_blank" rel="noreferrer">google map</a>}</span>} value={data.coordinates ? `${data.coordinates?.x} x ${data?.coordinates?.y}` : null} disabled={true} colorGray={false} key={"tđ"} />
          <BoxTextField label="Lần chỉnh sửa" value={data.modifyCount} disabled={true} colorGray={false} key={"lcs"} />
          <BoxTextField label="Sức chứa" value={data.capacity} disabled={true} colorGray={false} key={"sc"} />
          <BoxTextField label="Mở cửa lúc" value={data.openTime} disabled={true} colorGray={false} key={"mc"} />
          <BoxTextField label="Đóng cửa lúc" value={data.closeTime} disabled={true} colorGray={false} key={"đc"} />
          <BoxTextField label="Ngày đi vào hoạt động" value={formatTimestamp(data.openDate, "DD/MM/YYYY")} disabled={true} colorGray={false} key={"nđvhđ"} />
          <BoxTextField label="Trạng thái" value={data.status !== 1 ? LOCATION_STATUS[data.status].label : data.id ? "Chờ áp dụng" : LOCATION_STATUS[data.status].label} disabled={true} colorGray={false} key={"tt"} />
          <BoxTextField label="Lý do thay đổi trạng thái" value={data.reason} disabled={true} colorGray={false} key={"ldtđtt"} />
        </div>
        {/* checkbox */}
        <div>
          <BoxCheckBox label={"Mở cửa ngày lễ"} checked={true} />
        </div>
        <div>
          <QuillEditor style={{ margin: 10 }} value={data.description} readonly={false} key={"description"} />
        </div>
        {isModify && [3, 4, 5].includes(tab) &&
          <div>
            <div style={{ margin: "40px 0" }}>
              <OtherInfoModify data={data} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "0 16px" }}>
              {(!showAction) && <>
                <Button color="primary" variant="solid" style={{ margin: "0 8px" }} onClick={(event) => { handleConfirm(event, 1) }}>
                  <FaCheck />
                  Duyệt
                </Button>
                <Button color="danger" variant="outlined" style={{ margin: "0 8px" }} onClick={(event) => { handleConfirm(event, 2) }}>
                  <MdOutlineCancel />
                  Từ chối
                </Button>
              </>}
              <div>
                {action === 1 && <PopConfirmCustom type="warning" {...getMessagePopup(1)} handleOk={handleAllowApprove} handleCancel={handleCancelApprove} key={"approve"} />}
                {action === 2 && <PopConfirmCustom type="warning" {...getMessagePopup(2)} handleOk={handleAllowReject} handleCancel={handleCancelReject} key={"reject"} />}
              </div>
            </div>
          </div>}
      </div>}
    </div>
  )
}

export default BoxInfo
