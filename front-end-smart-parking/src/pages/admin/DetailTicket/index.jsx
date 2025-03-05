import { useParams } from "react-router-dom"
import "./style.css"
import {infoTicket, modifyInfoTicket} from "./fakedata"
import BoxInfo from "./BoxInfo";
import { Typography } from "antd";
const { Title } = Typography;

const DetailTicket = () => {
  const {isIdModify, tabStatus, id} = useParams();
  const isModifyDetail = tabStatus === "0"
  let dataModify = null;
  let dataRoot = null;
  // 1: tạo mới, 2: chỉnh sửa
  if(["1", "2"].includes(isIdModify)) {
    dataModify = modifyInfoTicket;
    if(dataModify.ticketid && isIdModify === "2") {
      dataRoot = infoTicket;
    }
  } else if(isModifyDetail) {
    dataRoot = infoTicket;
    dataModify = modifyInfoTicket;
  } else {
    dataRoot = infoTicket;
  }
  return (
    <div>
      <Title level={4} 
        style={{
          marginBottom: 16, 
          borderBottom: "1px solid rgb(185, 183, 183)",
          display: "inline-block"
        }}
        >Thông tin vé: {id} - của đối tác: {infoTicket.partnerName}</Title>
      <div className = {isModifyDetail && "modify"}>
        <div>
          <BoxInfo data={dataRoot} isModify={false}/>
        </div>
        {isModifyDetail && <div>
          <BoxInfo data={dataModify} isModify={true}/>
        </div>}
      </div>
    </div>
  )
}

export default DetailTicket
