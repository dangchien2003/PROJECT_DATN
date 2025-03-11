import { useParams } from "react-router-dom"
import "./style.css"
import {infoTicket, modifyInfoTicket} from "./fakedata"
import BoxInfo from "./BoxInfo";
import { Typography } from "antd";
const { Title } = Typography;

const DetailLocation = () => {
  const {tab, id} = useParams();
  console.log(id)
  const tabNumber = Number(tab);
  let dataModify = null;
  let dataRoot = null;
  // 1: đang hoạt động, 2: tạm dừng hoạt động, 3: thêm mới, 4: chỉnh sửa, 5: từ chối
  if([1, 2, 4].includes(tabNumber)) {
    dataRoot = infoTicket;
  }

  if([3, 4, 5].includes(tabNumber)){
    dataModify = modifyInfoTicket;
  }
  return (
    <div>
      <Title level={4} 
        style={{
          marginBottom: 16, 
          borderBottom: "1px solid rgb(185, 183, 183)",
          display: "inline-block"
        }}
        >Thông tin địa điểm: {dataRoot && dataRoot.id !== null ? dataRoot.id : dataModify.modifyId} - Quản lý bởi: {dataRoot && dataRoot.partnerName !== null ? dataRoot.partnerName : dataModify.partnerName}</Title>
      <div className = {dataModify && "modify"}>
        <div>
          <BoxInfo data={dataRoot} isModify={false}/>
        </div>
        {dataModify && <div>
          <BoxInfo data={dataModify} isModify={true}/>
        </div>}
      </div>
    </div>
  )
}

export default DetailLocation
