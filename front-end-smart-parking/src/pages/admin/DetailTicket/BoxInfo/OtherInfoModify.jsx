import BoxTextArea from '@/components/BoxTextArea'
import BoxTextField from '@/components/BoxTextField'
import DividerCustom from '@/components/DividerCustom'
import { isNullOrUndefined } from '@/utils/data'
import { formatTimestamp } from '@/utils/time'

const OtherInfoModify = ({data}) => {
  return (
    <div>
      <DividerCustom style={{width: "100%"}}/>
      <div className="box-ticket-detail">
       <BoxTextField label={"Thời gian áp dụng"} value={formatTimestamp(data.timeAppliedEdit, "DD/MM/YYYY HH:mm")} disabled={true}/>
      </div>
      {!isNullOrUndefined(data.rejectBy) && <BoxTextArea disabled={true} label={"Lý do từ chối"} value={data.reasonReject} rows={5} />}
    </div>
  )
}

export default OtherInfoModify
