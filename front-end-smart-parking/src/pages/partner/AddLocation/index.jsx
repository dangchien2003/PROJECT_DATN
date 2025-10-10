import CheckboxWithDash from "@/components/CheckboxWithDash";
import CoordinateInput from "@/components/CoordinateInput";
import DatePickerLabelDash from "@/components/DatePickerLabelDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import QuillEditorInput from "@/components/QuillEditorInput";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { useLoading } from "@/hook/loading";
import { useRequireField } from "@/hook/useRequireField";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { useMessageError } from "@/hook/validate";
import { locationDetail } from "@/service/locationService";
import { getDataApi } from "@/utils/api";
import { LOCATION_STATUS_SELECRBOX, MENU_PARTNER_ID } from "@/utils/constants";
import { extractGoogleMapCoords } from "@/utils/extract";
import { changeInput } from "@/utils/handleChange";
import { updateObjectValue } from "@/utils/object";
import { toastError } from "@/utils/toast";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Action from "./Action";
import AvatarAndVideo from "./AvatarAndVideo";

const indexKeys = ["name", "address", "coordinatesX", "coordinatesY", "capacity", "status", "reason", "timeAppliedEdit", "modifyDescription"]
const AddLocation = ({ isModify = false }) => {
  const { select } = useSelectMenu();
  const status = useRef(null)
  const [requireKeys, setRequireKeys] = useState([
    "name", "address", "coordinatesX", "coordinatesY", "capacity", "status", "timeAppliedEdit"
  ]);
  const dataSelectBox = useRef(LOCATION_STATUS_SELECRBOX.filter(item => item.value !== 0 && item.value !== 5))
  useEffect(() => {
    select(MENU_PARTNER_ID.QUAN_LY_DIA_DIEM_THEM);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const [dataModify, setDataModify] = useState({
    locationId: null,
    name: null,
    address: null,
    linkGoogleMap: null,
    coordinatesX: null,
    coordinatesY: null,
    openTime: "00:00:00",
    closeTime: "00:00:00",
    timeAppliedEdit: null,
    openHoliday: true,
    urgentApprovalRequest: false,
    modifyDescription: null,
    description: null,
    videoTutorial: null,
    avatar: null,
    capacity: null,
    reason: null
  })
  const [disableCoordinates, setDisableCoordinates] = useState(false)
  // const [openEveryTime, setOpenEveryTime] = useState(false)
  const { hideLoad, showLoad } = useLoading()
  const { id } = useParams()
  const { reset } = useMessageError()
  const { setRequireField } = useRequireField();
  const { deleteKey } = useMessageError();
  // load dữ liệu khi vào form chỉnh sửa
  useEffect(() => {
    if (id) {
      showLoad()
      // gọi api lấy dữ liệu
      locationDetail(id).then((response) => {
        const result = getDataApi(response);
        // if (result.openTime === "00:00:00" && result.openTime === result.closeTime) {
        //   setOpenEveryTime(true)
        // }
        setDataModify(result)
        status.current = result.status;
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
    reset();
    if (isModify) {
      setRequireKeys(pre => [...pre, "modifyDescription"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setRequireField(requireKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [requireKeys])
  const handleChange = (key, value) => {
    if (key === 'status' && isModify && value !== status.current) {
      if (!requireKeys.includes("reason")) {
        setRequireKeys(prev => [...prev, "reason"]);
      }
    } else if (key === 'status' && isModify && value === status.current) {
      setRequireKeys(prev => prev.filter(item => item !== "reason"));
      deleteKey("reason");
    }
    changeInput(dataModify, key, value);
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
      updateObjectValue(dataModify, "coordinatesX", coordinates.x);
      updateObjectValue(dataModify, "coordinatesY", coordinates.y);
    } else {
      setDisableCoordinates(false);
      updateObjectValue(dataModify, "coordinatesX", null);
      updateObjectValue(dataModify, "coordinatesY", null);

    }
    if (dataModify) {
      updateObjectValue(dataModify, key, value);
    }
  }

  // const handleClickEveryTime = (_, value) => {
  //   setOpenEveryTime(true);
  // if (value) {
  //   // Nếu mở mọi lúc thì set giờ về 00:00:00
  //   updateObjectValue(dataModify, "openTime", "00:00:00");
  //   updateObjectValue(dataModify, "closeTime", "00:00:00");
  // } else {
  //   updateObjectValue(dataModify, "openTime", null);
  //   updateObjectValue(dataModify, "closeTime", null);
  // }
  // }

  return (
    <div>
      <h3 style={{ paddingBottom: 8 }}>{isModify ? "Chỉnh sửa địa điểm" : "Thêm mới địa điểm"}</h3>
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
          prefixKey={"coordinates"}
          require={true}
          xInp={dataModify?.coordinatesX}
          yInp={dataModify?.coordinatesY}
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
        {/* <TimeInput
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
        /> */}
        <TextFieldLabelDash
          label={"Sức chứa"}
          placeholder={"Nhập sức chứa"}
          key={"succhua"}
          regex={/^[0-9]*$/}
          defaultValue={dataModify?.capacity}
          itemKey={"capacity"}
          callbackChangeValue={handleChange}
        />
        <SelectBoxLabelDash
          label={"Trạng thái"}
          data={dataSelectBox.current}
          defaultValue={dataModify.status}
          itemKey={"status"}
          callbackChangeValue={handleChange}
          placeholder={"Chọn trạng thái"}
        />
        {isModify && <TextFieldLabelDash
          label={"Lý do thay đổi trạng thái"}
          placeholder={"Nhập lý do"}
          itemKey={"reason"}
          callbackChangeValue={handleChange}
          disable={status.current === dataModify.status}
        />}
        <DateTimePickerWithSortLabelDash
          label="Thời điểm áp dụng"
          sort={false}
          format={"DD/MM/YYYY HH:mm"}
          formatShowTime={"HH:mm"}
          placeholder={"Chọn thời điểm áp dụng"}
          defaultValue={dataModify?.timeAppliedEdit}
          // min={dayjs().add(1, "day")}
          min={dayjs()}
          key={"tgad"}
          itemKey={"timeAppliedEdit"}
          callbackChangeValue={handleChangeValueInputOrder}
        />
        {/* <CheckboxWithDash
          label={"Mở cửa mọi lúc"}
          value={openEveryTime}
          key={"openEveryTime"}
          itemKey={"openEveryTime"}
          callbackChangeValue={handleClickEveryTime}
        /> */}
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