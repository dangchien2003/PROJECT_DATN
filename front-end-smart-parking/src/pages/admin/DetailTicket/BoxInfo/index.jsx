import BoxCheckBox from "@/components/BoxCheckBox"
import BoxTextField from "@/components/BoxTextField"
import { TICKET_STATUS, VEHICLE } from "@/utils/constants"
import { formatTimestamp } from "@/utils/time"
import OtherInfoModify from "./OtherInfoModify"
import { FaCheck } from "react-icons/fa6"
import { Button } from "antd"
import { MdOutlineCancel } from "react-icons/md"
import { formatCurrency } from "@/utils/number"
import { Typography } from "antd";
const { Title } = Typography;

const BoxPrice = ({checked, price, label})=> {
  return <div style={{display: "flex", flexWrap: "wrap"}}>
    <BoxCheckBox label={label} checked={checked}/>
    {checked && <BoxTextField label={"Giá bán"} value={`${formatCurrency(price)} đ`} disabled={true} hideLabel={true}/>}
  </div>
}

const BoxInfo = ({data, isModify}) => {
  const getPriceByType = (priceCategory) => {
    if(data.priceDetail !== null && data.priceDetail.length !== 0) {
      for(var i = 0; i < data.priceDetail.length; i++) {
        if(data.priceDetail[i].priceCategory === priceCategory) {
          return data.priceDetail[i];
        }
      }
    }
    return null;
  }
  return (
    <div>
      {data !== null && <div style={isModify ? {borderLeft: "1px solid rgb(185, 183, 183)"} : {}}>
        <Title style={{padding: "0 8px"}} level={5}>{isModify? "Thông tin chỉnh sửa" : "Thông tin gốc"}</Title>
        {/* Thông tin chính */}
        <div className="box-ticket-detail">
        {/* <BoxTextField label="Người tạo" value={} disabled={true} colorGray={false} key={"nt"}/> */}
        <BoxTextField label="Tên vé" value={data.name} disabled={true} colorGray={false} key={"nt"}/>
        <BoxTextField label="Lần chỉnh sửa" value={data.modifyCount} disabled={true} colorGray={false} key={"nt"}/>
        <BoxTextField label="Thời gian phát hành" value={formatTimestamp(data.releasedTime, "DD/MM/YYYY HH:mm")} disabled={true} colorGray={false} key={"nt"}/>
        <BoxTextField label="Phương tiện sử dụng" value={VEHICLE[data.vehicle].name} disabled={true} colorGray={false} key={"nt"}/>
        <BoxTextField label="Trạng thái" value={TICKET_STATUS[data.status].label} disabled={true} colorGray={false} key={"nt"}/>
        <BoxTextField label="Lý do thay đổi trạng thái" value={data.reason} disabled={true} colorGray={false} key={"nt"}/>
        
      </div>
        {/* price */}
        <div>
          <BoxPrice label="Mở bán theo giờ" checked={!!data.timeSlot} price={getPriceByType(0)?.price}/>
          <BoxPrice label="Mở bán theo ngày" checked={!!data.daySlot} price={getPriceByType(1)?.price}/>
          <BoxPrice label="Mở bán theo tuần" checked={!!data.weekSlot} price={getPriceByType(2)?.price}/>
          <BoxPrice label="Mở bán theo tháng" checked={!!data.monthSlot} price={getPriceByType(3)?.price}/>
          </div>
        {isModify && 
        <div>
          <OtherInfoModify data={data} />
          <div style={{ display: "flex", justifyContent: "center", padding: "0 16px" }}>
          <Button color="primary" variant="solid" style={{margin: "0 8px"}}>
            <FaCheck />
            Duyệt
          </Button>
          <Button color="danger" variant="outlined" style={{margin: "0 8px"}}>
            <MdOutlineCancel />
            Từ chối
          </Button>
        </div>
        </div> }
      </div>}
    </div>
  )
}

export default BoxInfo
