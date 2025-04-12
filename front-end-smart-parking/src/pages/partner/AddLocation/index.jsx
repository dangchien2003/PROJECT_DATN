import CoordinateInput from "@/components/CoordinateInput";
import DatePickerLabelDash from "@/components/DatePickerLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import TimeInput from "@/components/TimeInput";
import AvatarAndVideo from "./AvatarAndVideo";
import CheckboxWithDash from "@/components/CheckboxWithDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import Action from "./Action";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLoading } from "@/hook/loading";
import { updateObjectValue } from "@/utils/object";
import { extractGoogleMapCoords } from "@/utils/extract";
import { useMessageError } from "@/hook/validate";
import { useRequireField } from "@/hook/useRequireField";
import { changeInput } from "@/utils/handleChange";
import QuillEditorInput from "@/components/QuillEditorInput";
import { locationDetail } from "@/service/locationService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";

const requireKeys = ["name", "address", "openTime", "closeTime", "timeAppliedEdit", "description"]
const indexKeys = ["name", "address", "openTime", "closeTime", "timeAppliedEdit", "description"]
const AddLocation = ({ isModify = false }) => {
  const [dataModify, setDataModify] = useState({
    locationId: null,
    name: null,
    address: null,
    linkGoogleMap: null,
    coordinates: {
      x: null,
      y: null,
    },
    openTime: null,
    closeTime: null,
    timeAppliedEdit: null,
    openHoliday: true,
    urgentApprovalRequest: false,
    modifyDescription: null,
    description: null,
    videoTutorial: null,
    avatar: null
  })
  const [disableCoordinates, setDisableCoordinates] = useState(false)
  const [openEveryTime, setOpenEveryTime] = useState(false)
  const { hideLoad, showLoad } = useLoading()
  const { id } = useParams()
  const { reset } = useMessageError()
  const { setRequireField } = useRequireField();
  // load dữ liệu khi vào form chỉnh sửa
  useEffect(() => {
    if (id) {
      showLoad()
      // gọi api lấy dữ liệu
      locationDetail(id).then((response) => {
        const result = getDataApi(response);
        if (result.openTime = "00:00:00" && result.openTime === result.closeTime) {
          setOpenEveryTime(true)
        }
        setDataModify(result)
      })
        .catch((error) => {
          const dataError = getDataApi(error);
          toastError(dataError?.message)
        })
        .finally(() => {
          hideLoad()
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    reset()
    setRequireField(requireKeys)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (key, value) => {
    changeInput(dataModify, key, value)
  };

  const handleChangeValueInputOrder = (key, value, order) => {
    if (typeof key === "object" && key.length === 2) {
      updateObjectValue(dataModify, key[0], value);
      updateObjectValue(dataModify, key[1], order);
    } else {
      updateObjectValue(dataModify, key, value);
    }
  };

  const handleChangeLinkGoogleMap = (key, value) => {
    const coordinates = extractGoogleMapCoords(value);
    if (coordinates) {
      setDisableCoordinates(true)
      updateObjectValue(dataModify, "coordinates", coordinates);
    } else {
      setDisableCoordinates(false)
      updateObjectValue(dataModify, "coordinates", null);
    }
    if (dataModify) {
      updateObjectValue(dataModify, key, value);
    }
  }

  const handleClickEveryTime = (_, value) => {
    setOpenEveryTime(value)
    if (value) {
      // Nếu mở mọi lúc thì set giờ về 00:00:00
      updateObjectValue(dataModify, "openTime", "00:00:00");
      updateObjectValue(dataModify, "closeTime", "00:00:00");
    } else {
      updateObjectValue(dataModify, "openTime", null);
      updateObjectValue(dataModify, "closeTime", null);
    }
  }

  return (
    <div>
      <h3 style={{ paddingBottom: 8 }} onClick={() => {
        console.log(dataModify)
      }}>{isModify ? "Chỉnh sửa địa điểm" : "Thêm mới địa điểm"}</h3>
      <div>
        <AvatarAndVideo data={dataModify} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <TextFieldLabelDash
          label={"Tên địa điểm"}
          placeholder={"Nhập tên địa điểm"}
          key={"ten dd"}
          itemKey={"name"}
          defaultValue={dataModify?.name}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          label={"Địa chỉ"}
          placeholder={"Nhập địa chỉ"}
          key={"dia_chi"}
          itemKey={"address"}
          defaultValue={dataModify?.address}
          callbackChangeValue={handleChange}
        />
        <TextFieldLabelDash
          label={"Đường dẫn đến Google Map"}
          placeholder={"Nhập đường dẫn Google Map"}
          key={"gg map"}
          itemKey={"linkGoogleMap"}
          callbackChangeValue={handleChangeLinkGoogleMap}
          defaultValue={dataModify?.linkGoogleMap}
        />
        <CoordinateInput
          label={"Toạ độ (AxB)"}
          placeholder={"Nhập toạ độ"}
          key={"td"}
          itemKey={"coordinates"}
          value={dataModify?.coordinates}
          disable={disableCoordinates}
          callbackChangeValue={handleChange}
        />
        {isModify && <DatePickerLabelDash
          label={"Ngày mở cửa"}
          placeholder={"Chọn ngày mở cửa"}
          key={"ngay mo cua"}
          disable={true}
          format={"DD/MM/YYYY"}
          defaultValue={dataModify.openDate}
        />}
        <TimeInput
          label={"Thời gian mở cửa"}
          placeholder={"Chọn thời gian mở cửa"}
          key={"tgm"}
          itemKey={"openTime"}
          callbackChangeValue={handleChange}
          format="HH:mm"
          defaultValue={openEveryTime ? "00:00:00" : dataModify?.openTime}
          disable={openEveryTime}
        />
        <TimeInput
          label={"Thời gian đóng cửa"}
          placeholder={"Chọn thời gian đóng cửa"}
          key={"tgđ"}
          format="HH:mm"
          itemKey={"closeTime"}
          callbackChangeValue={handleChange}
          defaultValue={openEveryTime ? "00:00:00" : dataModify?.closeTime}
          disable={openEveryTime}
        />
        <CheckboxWithDash
          label={"Mở cửa mọi lúc"}
          value={openEveryTime}
          key={"openEveryTime"}
          itemKey={"openEveryTime"}
          callbackChangeValue={handleClickEveryTime}
        />
        {/* <TextFieldLabelDash
          label={"Sức chứa"}
          placeholder={"Nhập sức chứa"}
          key={"succhua"}
          regex={/^[0-9]*$/}
          defaultValue={dataModify?.capacity}
          itemKey={"capacity"}
          callbackChangeValue={handleChange}
        /> */}
        <DateTimePickerWithSortLabelDash
          label="Thời điểm áp dụng"
          sort={false}
          format={"DD/MM/YYYY HH:mm"}
          formatShowTime={"HH:mm"}
          placeholder={"Chọn thời điểm áp dụng"}
          defaultValue={dataModify?.timeAppliedEdit}
          key={"tgad"}
          itemKey={"timeAppliedEdit"}
          callbackChangeValue={handleChangeValueInputOrder}
        />
        <CheckboxWithDash
          label={"Mở cửa ngày lễ"}
          value={dataModify?.openHoliday}
          key={"mcnl"}
          itemKey={"openHoliday"}
          callbackChangeValue={handleChange}
        />
        <CheckboxWithDash
          label={"Yêu cầu duyệt khẩn cấp"}
          value={dataModify?.urgentApprovalRequest}
          key={"dkc"}
          itemKey={"urgentApprovalRequest"}
          callbackChangeValue={handleChange}
        />
      </div>
      {isModify && <div>
        <TextFieldLabelDash
          label={"Nội dung chỉnh sửa"}
          placeholder={"Nhập nội dung chỉnh sửa"}
          key={"ndcs"}
          defaultValue={dataModify?.modifyDescription}
          itemKey={"modifyDescription"}
          callbackChangeValue={handleChange}
        />
      </div>}
      <QuillEditorInput
        label={"Mô tả về địa điểm"}
        itemKey={"description"}
        key={"description"}
        defaultValue={dataModify?.description}
        callbackChangeValue={handleChange}
      />
      <Action isModify={isModify} data={dataModify} requireKeys={requireKeys} indexKey={indexKeys} />
    </div>
  );
};

export default AddLocation;