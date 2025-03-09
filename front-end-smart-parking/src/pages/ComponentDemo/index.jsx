import CardCustom from "@/components/CardCustom"
import DatePickerLabelDash from "@/components/DatePickerLabelDash"
import DateTimePickerWithSortLabelDash from "@/components/DateTimePickerWithSortLabelDash"
import DividerCustom from "@/components/DividerCustom"

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
    </div>
  )
}

export default ComponentDemo
