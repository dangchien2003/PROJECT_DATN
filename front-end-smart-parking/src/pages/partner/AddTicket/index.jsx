import CheckboxWithDash from "@/components/CheckboxWithDash";
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash";
import SelectBoxLabelDash from "@/components/SelectBoxLabelDash";
import { useRequireField } from "@/hook/useRequireField";
import { useMessageError } from "@/hook/validate";
import { MENU_PARTNER_ID, TICKET_STATUS, VEHICLE } from "@/utils/constants";
import { changeInput } from "@/utils/handleChange";
import { convertObjectToDataSelectBox } from "@/utils/object";
import { useEffect, useRef, useState } from "react"
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
import { useSelectMenu } from "@/hook/useSelectMenu";

const indexKeys = ["name", "description", "vehicle", "status", "reason", "timeAppliedEdit", "priceTimeSlot", "priceDaySlot", "priceWeekSlot", "priceMonthSlot"]
const AddTicket = () => {
  const { select } = useSelectMenu();
  const status = useRef(null)
  const [requireKeys, setRequireKeys] = useState(["name", "description", "vehicle", "status", "timeAppliedEdit", "priceTimeSlot", "priceDaySlot", "priceWeekSlot", "priceMonthSlot"]);
  useEffect(() => {
    select(MENU_PARTNER_ID.QUAN_LY_VE_TAO_MOI);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const { setRequireField } = useRequireField();
  const { reset, pushMessage, deleteKey, deleteManyKey } = useMessageError()
  const [timeSlotChecked, setTimeSlotChecked] = useState(true);
  const [daySlotChecked, setDaySlotChecked] = useState(true);
  const [weekSlotChecked, setWeekSlotChecked] = useState(true);
  const [monthSlotChecked, setMonthSlotChecked] = useState(true);
  const [isModify, setIsmodify] = useState(false);
  const { showLoad, hideLoad } = useLoading();
  const { id } = useParams();
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
    priceTimeSlot: null,
    priceDaySlot: null,
    priceWeekSlot: null,
    priceMonthSlot: null,
    locationUse: [],
    status: null
  })

  useEffect(() => {
    setRequireField(requireKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [requireKeys])

  useEffect(() => {
    // reset form
    reset()
    setRequireField(requireKeys)
    // xác định hành động
    setIsmodify(!isNullOrUndefined(id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isModify) return;
    // lấy dữ liệu bản ghi
    showLoad("Đang tải dữ liệu")
    detail(id).then((response) => {
      const result = getDataApi(response);
      // setData
      dataModify.ticketId = result.ticketId;
      dataModify.name = result.name;
      dataModify.status = result.status;
      status.current = result.status;
      dataModify.description = result.description;
      dataModify.timeAppliedEdit = result.timeAppliedEdit;
      dataModify.vehicle = result.vehicle;
      dataModify.timeSlot = !!result.priceTimeSlot;
      dataModify.daySlot = !!result.priceDaySlot;
      dataModify.weekSlot = !!result.priceWeekSlot;
      dataModify.monthSlot = !!result.priceMonthSlot;
      // set lại giá
      changeCheckBox("price.time", result.priceTimeSlot);
      changeCheckBox("price.day", result.priceDaySlot);
      changeCheckBox("price.week", result.priceWeekSlot);
      changeCheckBox("price.month", result.priceMonthSlot);
      dataModify.locationUse = result.locationUse;
      // lưu lại dữ liệu
      setDataModify({ ...dataModify });
    }).catch((error) => {
      const response = getDataApi(error);
      toastError(response.message);
      return;
    }).finally(() => {
      hideLoad();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModify])

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
    // thời gian
    if (dataModify.timeSlot) {
      keysPush.push("priceTimeSlot");
    } else {
      keysMove.push("priceTimeSlot");
    }
    // ngày
    if (dataModify.daySlot) {
      keysPush.push("priceDaySlot");
    } else {
      keysMove.push("priceDaySlot");
    }
    // tuần
    if (dataModify.weekSlot) {
      keysPush.push("priceWeekSlot");
    } else {
      keysMove.push("priceWeekSlot");
    }
    // tháng
    if (dataModify.monthSlot) {
      keysPush.push("priceMonthSlot");
    } else {
      keysMove.push("priceMonthSlot");
    }
    setTimeSlotChecked(dataModify.timeSlot);
    setDaySlotChecked(dataModify.daySlot);
    setWeekSlotChecked(dataModify.weekSlot);
    setMonthSlotChecked(dataModify.monthSlot);
    // set require
    setRequireKeys(requireKeys.concat(keysPush).filter(item => !keysMove.includes(item)))
    deleteManyKey(keysMove);
    keysMove.forEach(item => {
      changeInput(dataModify, item, null);
    })
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
          require={true}
        />
        <SelectBoxLabelDash
          label={"Trạng thái"}
          data={convertObjectToDataSelectBox(TICKET_STATUS).filter(item => item.value !== 0 && item.value !== 4)}
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
            itemKey={"priceTimeSlot"}
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
            itemKey={"priceDaySlot"}
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
            itemKey={"priceWeekSlot"}
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
            itemKey={"priceMonthSlot"}
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
