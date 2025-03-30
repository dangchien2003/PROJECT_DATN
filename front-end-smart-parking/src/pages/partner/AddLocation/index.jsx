import CoordinateInput from "@/components/CoordinateInput";
import DatePickerLabelDash from "@/components/DatePickerLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import TimeInput from "@/components/TimeInput";
import AvatarAndVideo from "./AvatarAndVideo";
import QuillEditor from "@/components/QuillEditor";
import CheckboxWithDash from "@/components/CheckboxWithDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
// import { extractGoogleMapCoords } from "@/utils/extract";
import Action from "./Action";
import { dataEdit } from "./fakeData";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayj from "dayjs";
import { useLoading } from "@/utils/loading";
import { updateObjectValue } from "@/utils/object";
import { extractGoogleMapCoords } from "@/utils/extract";

const AddLocation = ({isModify = false}) => {
  const [dataModify, setDataModify] = useState({})
  const [disableCoordinates, setDisableCoordinates] = useState(false)
  const {hideLoad, showLoad} = useLoading()
  const {id} = useParams()
  console.log(id)
  useEffect(() => {
    let timeOutId;
    if(id) {
      showLoad()
      timeOutId = setTimeout(() => {
        setDataModify(dataEdit)
        hideLoad()
      }, 1000)
    }else {
      setDataModify({})
    }
    return () => {
      clearTimeout(timeOutId)
    }
  }, [id])

  const handleChange = (value, key) => {
    if (dataModify) {
      updateObjectValue(dataModify, key, value);
    }
  };

  const handleChangeValueInputOrder = (value, order, key) => {
    if (typeof key === "object" && key.length === 2) {
      updateObjectValue(dataModify, key[0], value);
      updateObjectValue(dataModify, key[1], order);
    } else {
      updateObjectValue(dataModify, key, value);
    }
  };

  const handleChangeLinkGoogleMap = (value, key) => {
    const coordinates = extractGoogleMapCoords(value);
    if(coordinates) {
      setDisableCoordinates(true)
      updateObjectValue(dataModify, "coordinates", coordinates);
    }else {
      setDisableCoordinates(false)
      updateObjectValue(dataModify, "coordinates", null);
    }
    if (dataModify) {
      updateObjectValue(dataModify, key, value);
    }
  }

  const handleClick = () => {
    console.log(dataModify)
  }

  return (
    <div>
      <button onClick={handleClick}>click</button>
      <h3 style={{ paddingBottom: 8 }}>{isModify ? "Chỉnh sửa địa điểm" : "Thêm mới địa điểm"}</h3>
      <div>
        <AvatarAndVideo data={dataModify}/>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap"}}>
        <TextFieldLabelDash
          label={"Tên địa điểm"}
          placeholder={"Nhập tên địa điểm"}
          key={"ten dd"}
          itemKey={"name"}
          defaultValue={dataModify?.name}
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
          defaultValue={dataModify?.coordinates ? dataModify?.coordinates : {}}
          disable={disableCoordinates}
        />
        {isModify && <DatePickerLabelDash
          label={"Ngày mở cửa"}
          placeholder={"Chọn ngày mở cửa"}
          key={"ngay mo cua"} 
          disable={true}
          format={"DD/MM/YYYY"}
          defaultValue={dataModify?.openDate && dayj(dataModify?.openDate, "DD/MM/YYYY")}
        />}
        <TimeInput
          label={"Thời gian mở cửa"}
          placeholder={"Chọn thời gian mở cửa"}
          key={"tgm"}
          itemKey={"openTime"}
          callbackChangeValue={handleChange}
          format="HH:mm"
          defaultValue={dataModify?.openTime && dayj(dataModify?.openTime, "HH:mm")}
        />
        <TimeInput
          label={"Thời gian đóng cửa"}
          placeholder={"Chọn thời gian đóng cửa"}
          key={"tgđ"}
          format="HH:mm"
          itemKey={"closeTime"}
          callbackChangeValue={handleChange}
          defaultValue={dataModify?.closeTime && dayj(dataModify?.closeTime, "HH:mm")}
        />
        <CheckboxWithDash 
          label={"Mở cửa mọi lúc"} 
          value={false} 
          key={"ml"}
        />
        <TextFieldLabelDash
          label={"Sức chứa"}
          placeholder={"Nhập sức chứa"}
          key={"succhua"}
          regex={/^[0-9]*$/}
          defaultValue={dataModify?.capacity}
          itemKey={"capacity"}
          callbackChangeValue={handleChange}
        />
        <DateTimePickerWithSortLabelDash 
          label="Thời điểm áp dụng" 
          sort={false}
          format={"DD/MM/YYYY HH:mm"} 
          formatShowTime={"HH:mm"} 
          placeholder={"Chọn thời điểm áp dụng"}
          defaultValue={dataModify?.timeAppliedEdit && dayj(dataModify?.timeAppliedEdit, "DD/MM/YYYY HH:mm")}
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
      <div style={{paddingTop: 8}}>
        <div
          style={{
            position: "relative",
            width: 250,
            paddingBottom: 0,
            borderTop: "1px solid #B9B7B7",
            margin: 16,
          }}
        >
          <span
            className="truncated-text"
            style={{
              position: "absolute",
              display: "inline-block",
              padding: "3px 5px",
              top: -14,
              left: 8,
              maxWidth: 240,
              fontSize: 14,
              background: "white",
              zIndex: 100,
            }}
          >
            Mô tả về địa điểm
          </span>
        </div>
      <QuillEditor 
        style={{margin: "15px 30px"}} 
        value={dataModify?.description}
        onChange={(value) => {handleChange(value, "description")}}
        />
      </div>
      <Action isModify={isModify}/>
    </div>
  );
};

export default AddLocation;