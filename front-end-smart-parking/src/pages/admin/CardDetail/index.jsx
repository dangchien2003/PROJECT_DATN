import "./style.css"
import CardCustom from "@/components/CardCustom"
import { Typography } from "antd";
import CardAction from "./CardAction";
import TableActionHistoryCard from "@/components/TableActionHistoryCard";
import { useParams } from "react-router-dom";
const { Title } = Typography;


const CardDetail = () => {
  const {waiting, id} = useParams();
  console.log(id)
  const isWaitApprove = waiting === "1"
  return (
    <div className="card-detail">
      <div className="detail" style={isWaitApprove ? { width: "100%"} : {}}>
        <div >
          <Title style={{padding: "0 8px"}} level={5}>{isWaitApprove ? "Thông tin yêu cầu" : "Thông tin thẻ"}</Title>
          <div className={isWaitApprove && "jcc"}>
            <div>
              <CardCustom isAdmin={true} isWaitApprove={isWaitApprove}/>
              <div className="action">
                <CardAction isWaitApprove={isWaitApprove}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isWaitApprove && <div className="history">
         <Title style={{padding: "0 16px"}} level={5}>Lịch sử hoạt động</Title>
         <div style={{paddingLeft: 8, width: "100%"}}>
            <TableActionHistoryCard/>
         </div>
      </div>}
    </div>
  )
}

export default CardDetail
