import BoxCheckBox from "@/components/BoxCheckBox"
import BoxTextField from "@/components/BoxTextField"
import { TICKET_STATUS } from "@/utils/constants"
import { formatTimestamp } from "@/utils/time"
import OtherInfoModify from "./OtherInfoModify"
import { FaCheck } from "react-icons/fa6"
import { Button } from "antd"
import { MdOutlineCancel } from "react-icons/md"
import { Typography } from "antd";
import Avatar from "../../AccountCustomerInfo/Avatar"
// import QuillEditor from "@/components/QuillEditor"
import { useEffect, useState } from "react"
const { Title } = Typography;
const linkImage = "https://i0.wp.com/plopdo.com/wp-content/uploads/2021/11/feature-pic.jpg?w=537&ssl=1"
const BoxInfo = ({data, isModify}) => {
  const [styleParent, setStyleParent] = useState({})
  useEffect(() => {
    const handleResize = () => {
      let style = {};
      if(isModify) {
        if(window.innerWidth <= 1288) {
          style = {
            borderTop: "1px solid rgb(185, 183, 183)",
            paddingTop: 8,
            marginTop: 104
          }
        } else {
          style = {
            borderLeft: "1px solid rgb(185, 183, 183)"
          }
        }
      }
      
      setStyleParent(style)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isModify]);
  return (
    <div>
      {data !== null && <div style={styleParent}>
        <Title style={{padding: "0 8px"}} level={5}>{isModify? "Thông tin chỉnh sửa" : "Thông tin gốc"}</Title>
        {/* Thông tin chính */}
        <div style={{display: "flex", gap: 8, padding: "0 16px"}}>
          <div>
            <Avatar linkImage={linkImage}/>
            <Title level={5} style={{textAlign: "center"}}>Ảnh đại diện</Title>
          </div>
          <div style={{flex: 1}}>
            {true ? 
              <div style={{width: "100%"}}>
                <iframe width={"100%"} height={210} src="https://www.youtube.com/embed/m6P5XLSKMnk?si=OAXSDfqe1vpf02LQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <Title level={5} style={{textAlign: "center"}}>Video giới thiệu</Title>
              </div> 
              : <div>
                  <div style={{height: 210, display: "flex", alignItems: "center", justifyContent: "center"}}>Không tìm thấy video giới thiệu</div>
                  <Title level={5} style={{textAlign: "center"}}>Video giới thiệu</Title>
              </div>}
          </div>
        </div>
        <div className="box-ticket-detail">
          <BoxTextField label="Tên địa điểm" value={data.name} disabled={true} colorGray={false} key={"nt"}/>
          <BoxTextField label={<span>Tạo độ {data.linkGoogleMap && <a href={data.linkGoogleMap} target="_blank" rel="noreferrer">google map</a>}</span>} value={data.coordinates} disabled={true} colorGray={false} key={"tđ"}/>
          <BoxTextField label="Lần chỉnh sửa" value={data.modifyCount} disabled={true} colorGray={false} key={"lcs"}/>
          <BoxTextField label="Sức chứa" value={133} disabled={true} colorGray={false} key={"nđvhđ"}/>
          <BoxTextField label="Mở cửa lúc" value={"00:00"} disabled={true} colorGray={false} key={"mc"}/>
          <BoxTextField label="Đóng cửa lúc" value={"00:00"} disabled={true} colorGray={false} key={"đc"}/>
          <BoxTextField label="Ngày đi vào hoạt động" value={formatTimestamp(data.releasedTime, "DD/MM/YYYY")} disabled={true} colorGray={false} key={"nđvhđ"}/>
          <BoxTextField label="Trạng thái" value={TICKET_STATUS[data.status].label} disabled={true} colorGray={false} key={"nt"}/>
          <BoxTextField label="Lý do thay đổi trạng thái" value={data.reason} disabled={true} colorGray={false} key={"nt"}/>
        </div>
        {/* checkbox */}
        <div>
          <BoxCheckBox label={"Mở cửa ngày lễ"} checked={true}/>
        </div>
        <div>
          {/* <QuillEditor style={{margin: 10}}/> */}
        </div>
        {isModify && 
        <div>
          <div style={{margin: "40px 0"}}>
            <OtherInfoModify data={data} />
          </div>
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
