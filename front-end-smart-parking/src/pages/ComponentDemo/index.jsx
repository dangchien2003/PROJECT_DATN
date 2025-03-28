import BoxUploadImage from "@/components/BoxUploadImage"
import CardCustom from "@/components/CardCustom"
import CoordinateInput from "@/components/CoordinateInput"
import DatePickerLabelDash from "@/components/DatePickerLabelDash"
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash"
import DividerCustom from "@/components/DividerCustom"
import TimeInput from "@/components/TimeInput"
import dayjs from 'dayjs';

const ComponentDemo = () => {
  return (
    <div>
      <div style={{display: "flex", gap: 20}}>
        <div><CardCustom /></div>
        <div><CardCustom isAdmin={true}/></div>
      </div>
      <div>
        <DatePickerLabelDash label={"label"}/>
      </div>
      <div>
        <DateTimePickerWithSortLabelDash label={"label"}/>
      </div>
      <div>
        <DividerCustom />
      </div>
      <div>
        <DividerCustom />
      </div>
      <div>
        <CoordinateInput
          label={"Toạ độ (AxB)"}
          placeholder={"Nhập toạ độ"}
          key={"td"}
          disable={true}
          defaultValue={{x: 42.532535, y: 34.5555}}
        />
        <CoordinateInput
          label={"Toạ độ (AxB)"}
          placeholder={"Nhập toạ độ"}
          key={"td"}
        />
      </div>
       <div>
        <TimeInput
          label={"Thời gian mở cửa"}
          placeholder={"Chọn thời gian mở cửa"}
          key={"tgm"}
          format="HH:mm"
          defaultValue={dayjs('13:30:56', 'HH:mm:ss')}
        />
      </div>
      <div style={{width: 200}}>
        upload ảnh
        <BoxUploadImage image={null} />
      </div>
    </div>
  )
}

export default ComponentDemo
