import BoxCheckBox from '@/components/BoxCheckBox'
import BoxTextArea from '@/components/BoxTextArea'
import BoxTextField from '@/components/BoxTextField'
import DividerCustom from '@/components/DividerCustom'
import { formatTimestamp } from '@/utils/time'
import React from 'react'

const OtherInfoModify = ({data}) => {
  return (
    <div>
      <DividerCustom style={{width: "100%"}}/>
      <div className="box-ticket-detail">
       <BoxTextField label={"Thời gian áp dụng"} value={formatTimestamp(data.timeAppliedEdit, "DD/MM/YYYY HH:mm")} disabled={true}/>
        <BoxCheckBox label={"Yêu cầu duyệt khẩn cấp"} checked={!!data.urgentApprovalRequest}/>
      </div>
      <div>
        <BoxTextArea label={"Nội dung thay đổi"} value={data.modifyDescription} rows={5} disabled={true}/>
      </div>
    </div>
  )
}

export default OtherInfoModify
