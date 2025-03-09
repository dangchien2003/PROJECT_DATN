import "./style.css"
import CardCustom from "@/components/CardCustom"
import { Typography } from "antd";
import CardAction from "./CardAction";
import TableActionHistoryCard from "@/components/TableActionHistoryCard";
const { Title } = Typography;


const CardDetail = () => {
  return (
    <div className="card-detail">
      <div className="detail">
         <Title style={{padding: "0 8px"}} level={5}>Thông tin thẻ</Title>
        <CardCustom isAdmin={true}/>
        <div className="action">
          <CardAction />
        </div>
      </div>
      <div className="history">
         <Title style={{padding: "0 16px"}} level={5}>Lịch sử hoạt động</Title>
         <div style={{paddingLeft: 8, width: "100%"}}>
            <TableActionHistoryCard/>
         </div>
      </div>
    </div>
  )
}

export default CardDetail
