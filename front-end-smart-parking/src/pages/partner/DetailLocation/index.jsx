import { useParams } from "react-router-dom"
import "./style.css"
import {infoTicket, modifyInfoTicket} from "./fakedata"
import BoxInfo from "./BoxInfo";
import { Typography } from "antd";
import { useEffect, useState } from "react";
const { Title } = Typography;

const DetailLocation = () => {
  const {tab, id} = useParams();
  const [styleParent, setStyleParent] = useState({})
  const [widthPage, setWidthPage] = useState(window.innerWidth)
  const [dataModify, setDataModify] = useState(null)
  const [dataRoot, setDataRoot] = useState(null)
  const tabNumber = Number(tab);
  console.log(id)
  useEffect(()=> {
    // 1: đang hoạt động, 2: tạm dừng hoạt động, 3: Chờ duyệt, 4: từ chối
    if([1, 2].includes(tabNumber)) {
      setDataRoot(infoTicket);
    }

    if([3, 4].includes(tabNumber)){
      setDataModify(modifyInfoTicket);
      if(modifyInfoTicket.ticketid && id === "2") {
        setDataRoot(infoTicket);
      }
    }
  }, [tabNumber, id])

  // responsive
  useEffect(() => {
    const handleResize = () => {
      let style = {};
      if(window.innerWidth <= 1288) {
        style = {
          width: "100%"
        }
      } else {
        style = {
          width: "50%"
        }
      }
      
      setStyleParent(style)
      setWidthPage(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <Title level={4} 
        style={{
          marginBottom: 16, 
          borderBottom: "1px solid rgb(185, 183, 183)",
          display: "inline-block"
        }}
        >Thông tin địa điểm: {dataRoot && dataRoot?.id !== null ? dataRoot?.id : dataModify?.modifyId}</Title>
      <div className = {dataModify && "modify"}>
        <div style={styleParent}>
          <BoxInfo data={dataRoot} isModify={false} widthPage={widthPage} tab={tabNumber} hasModify={dataModify !== null}/>
        </div>
        {dataModify && <div style={styleParent}>
          <BoxInfo data={dataModify} isModify={true} widthPage={widthPage} tab={tabNumber} hasModify={false}/>
        </div>}
      </div>
    </div>
  )
}

export default DetailLocation
