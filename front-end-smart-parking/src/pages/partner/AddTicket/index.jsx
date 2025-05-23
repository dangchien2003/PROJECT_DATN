import CheckboxWithDash from "@/components/CheckboxWithDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { VEHICLE } from "@/utils/constants";
import { changeInput } from "@/utils/handleChange";
import { convertObjectToDataSelectBox } from "@/utils/object";
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { dateTimeAffterNow } from "@/utils/validate";
import NumberInputWithSortLabelDash from "@/components/NumberInputWithSortLabelDash";
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import Action from "./Action";
import SelectLocation from "./SelectLocation";
import { useParams } from "react-router-dom";
import { isNullOrUndefined } from "@/utils/data";
import { detail } from "@/service/ticketService";
import { getDataApi } from "@/utils/api";
import { toastError } from "@/utils/toast";
import { useLoading } from "@/hook/loading";

let requireKeys = ["name", "description", "vehicle", "timeAppliedEdit", "price.time", "price.day", "price.week", "price.month"]
const indexKeys = ["name", "description", "vehicle", "timeAppliedEdit", "price.time", "price.day", "price.week", "price.month"]
const AddTicket = () => {
  const { setRequireField } = useRequireField();
  const { reset, pushMessage, deleteKey, deleteManyKey } = useMessageError()
  const [timeSlotChecked, setTimeSlotChecked] = useState(true);
  const [daySlotChecked, setDaySlotChecked] = useState(true);
  const [weekSlotChecked, setWeekSlotChecked] = useState(true);
  const [monthSlotChecked, setMonthSlotChecked] = useState(true);
  const [isModify, setIsmodify] = useState(false);
  const {showLoad, hideLoad} = useLoading();
  const {id} = useParams();
  const [dataModify, setDataModify] = useState({
    ticketId: id,
    name: null,
    description: null,
    timeAppliedEdit: null,
    vehicle: null,
    timeSlot: true,
    daySlot: true,
    weekSlot: true,
    monthSlot: true,
    price: {
      time: null,
      day: null,
      week: null,
      month: null,
    },
    locationUse: []
  })

  useEffect(() => {
    // reset form
    reset()
    setRequireField(requireKeys)
    // xác định hành động
    setIsmodify(!isNullOrUndefined(id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=> {
    if(!isModify) return;
    // lấy dữ liệu bản ghi
    showLoad("Đang tải dữ liệu")
    detail(id).then((response) => {
      const result = getDataApi(response);
      // setData
      dataModify.ticketId = result.ticketId;
      dataModify.name = result.name;
      dataModify.description = result.description;
      dataModify.timeAppliedEdit = result.timeAppliedEdit;
      dataModify.vehicle = result.vehicle;
      dataModify.timeSlot = result.timeSlot;
      dataModify.daySlot = result.daySlot;
      dataModify.weekSlot = result.weekSlot;
      dataModify.monthSlot = result.monthSlot;
      // set lại giá
      changeCheckBox("price.time", result.price.time?.price)
      changeCheckBox("price.day", result.price.day?.price)
      changeCheckBox("price.week", result.price.week?.price)
      changeCheckBox("price.month", result.price.month?.price)
      dataModify.locationUse = result.locationUse;
      // lưu lại dữ liệu
      setDataModify({...dataModify});
      
    }).catch((error) => {
      console.error(error)
      const response = getDataApi(error);
      toastError(response.message);
      return;
    }).finally(() => {
      hideLoad();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModify])

  const handleChange = (key, value) => {
    changeInput(dataModify, key, value)
  };

  const handleChangeValueTimeApplied = (key, value) => {
    changeInput(dataModify, key, value);
    try {
      if (value) {
        if (!dateTimeAffterNow(1, "day", value)) {
          pushMessage("timeAppliedEdit", "Dữ không hợp lệ");
        } else {
          deleteKey(key)
        }
      }
    } catch (error) {
      console.error(error)
      pushMessage("timeAppliedEdit", "Có lỗi xảy ra");
    }
  }

  // kiểm tra dữ liệu thời gian áp dụng mỗi giây
  useEffect(() => {
    let id = setInterval(() => {
      if (dataModify?.timeAppliedEdit) {
        handleChangeValueTimeApplied("timeAppliedEdit", dataModify?.timeAppliedEdit);
      }
    }, 1000)
    return () => {
      clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const changeCheckBox = (key, value) => {
    changeInput(dataModify, key, value);
    const keysMove = [];
    const keysPush = [];
    const preKey = "price."
    // thời gian
    if (dataModify.timeSlot) {
      keysPush.push(preKey + "time");
    } else {
      keysMove.push(preKey + "time");
    }
    // ngày
    if (dataModify.daySlot) {
      keysPush.push(preKey + "day");
    } else {
      keysMove.push(preKey + "day");
    }
    // tuần
    if (dataModify.weekSlot) {
      keysPush.push(preKey + "week");
    } else {
      keysMove.push(preKey + "week");
    }
    // tháng
    if (dataModify.monthSlot) {
      keysPush.push(preKey + "month");
    } else {
      keysMove.push(preKey + "month");
    }
    setTimeSlotChecked(dataModify.timeSlot);
    setDaySlotChecked(dataModify.daySlot);
    setWeekSlotChecked(dataModify.weekSlot);
    setMonthSlotChecked(dataModify.monthSlot);
    // set require
    requireKeys = requireKeys.concat(keysPush).filter(item => !keysMove.includes(item))
    setRequireField(requireKeys);
    deleteManyKey(keysMove)
  }
  return (
    <div>
      <h3 style={{ paddingBottom: 8 }}>{isModify ? "Chỉnh sửa thông tin vé" : "Thêm mới vé"}</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <TextFieldLabelDash
          label={"Tên vé"}
          placeholder={"Nhập tên vé"}
          key={"name"}
          itemKey={"name"}
          defaultValue={dataModify?.name}
          callbackChangeValue={handleChange}
          maxLength={100}
        />
        <TextFieldLabelDash
          label={"Mô tả quyền lợi"}
          placeholder={"Nhập mô tả"}
          key={"description"}
          itemKey={"description"}
          defaultValue={dataModify?.description}
          callbackChangeValue={handleChange}
          maxLength={1000}
        />
        <SelectBoxLabelDash
          label={"Phương tiện sử dụng"}
          placeholder={"Chọn phương tiện"}
          key={"Phương tiện sử dụng"}
          itemKey={"vehicle"}
          defaultValue={dataModify?.vehicle}
          callbackChangeValue={handleChange}
          data={convertObjectToDataSelectBox(VEHICLE)}
        />
        <DateTimePickerWithSortLabelDash
          label="Thời điểm áp dụng"
          sort={false}
          format={"DD/MM/YYYY HH:mm"}
          formatShowTime={"HH:mm"}
          placeholder={"Chọn thời điểm áp dụng"}
          defaultValue={dataModify?.timeAppliedEdit}
          key={"timeAppliedEdit"}
          itemKey={"timeAppliedEdit"}
          callbackChangeValue={handleChangeValueTimeApplied}
          min={dayjs().add(1, "day")}
          helpText="Thời gian áp dụng phải sau thời gian gửi yêu cầu ít nhất 1 ngày"
        />
        <div style={{ display: "inline-block" }}>
          <CheckboxWithDash
            label={"Mở bán vé theo khung giờ"}
            value={dataModify?.timeSlot}
            key={"timeSlot"}
            itemKey={"timeSlot"}
            callbackChangeValue={changeCheckBox}
          />
          {timeSlotChecked && <NumberInputWithSortLabelDash
            label={"Nhập giá 1 giờ"}
            placeholder={"Nhập giá vé 1 giờ"}
            key={"Nhập giá vé 1 giờ"}
            itemKey={"price.time"}
            defaultValue={dataModify?.price?.time}
            callbackChangeValue={handleChange}
            addonAfter="đ/giờ"
            trend={false}
            min={0}
          />}
        </div>
        <div style={{ display: "inline-block" }}>
          <CheckboxWithDash
            label={"Mở bán vé ngày"}
            value={dataModify?.daySlot}
            key={"daySlot"}
            itemKey={"daySlot"}
            callbackChangeValue={changeCheckBox}
          />
          {daySlotChecked && <NumberInputWithSortLabelDash
            label={"Nhập giá 1 ngày"}
            placeholder={"Nhập giá vé ngày"}
            key={"Nhập giá vé ngày"}
            itemKey={"price.day"}
            defaultValue={dataModify?.price?.day}
            callbackChangeValue={handleChange}
            addonAfter="đ"
            trend={false}
            min={0}
          />}
        </div>
        <div style={{ display: "inline-block" }}>
          <CheckboxWithDash
            label={"Mở bán vé tuần"}
            value={dataModify?.weekSlot}
            key={"weekSlot"}
            itemKey={"weekSlot"}
            callbackChangeValue={changeCheckBox}
          />
          {weekSlotChecked && <NumberInputWithSortLabelDash
            label={"Nhập giá 1 tuần"}
            placeholder={"Nhập giá vé tuần"}
            key={"Nhập giá vé tuần"}
            itemKey={"price.week"}
            defaultValue={dataModify?.price?.week}
            callbackChangeValue={handleChange}
            addonAfter="đ"
            trend={false}
            min={0}
          />}
        </div>
        <div style={{ display: "inline-block" }}>
          <CheckboxWithDash
            label={"Mở bán vé tháng"}
            value={dataModify?.monthSlot}
            key={"monthSlot"}
            itemKey={"monthSlot"}
            callbackChangeValue={changeCheckBox}
          />
          {monthSlotChecked && <NumberInputWithSortLabelDash
            label={"Nhập giá 1 tháng"}
            placeholder={"Nhập giá vé tháng"}
            key={"Nhập giá vé tháng"}
            itemKey={"price.month"}
            defaultValue={dataModify?.price?.month}
            callbackChangeValue={handleChange}
            addonAfter="đ"
            trend={false}
            min={0}
          />}
        </div>
      </div>
      <div>
        <h4 style={{ paddingBottom: 8 }}>Chọn địa điểm áp dụng</h4>
        <SelectLocation data={dataModify} />
      </div>
      <Action isModify={isModify} data={dataModify} requireKeys={requireKeys} indexKey={indexKeys} />
    </div>
  )
}

export default AddTicket
