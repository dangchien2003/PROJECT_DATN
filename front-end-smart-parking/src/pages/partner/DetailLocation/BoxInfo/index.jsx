import BoxCheckBox from "@/components/BoxCheckBox"
import BoxTextField from "@/components/BoxTextField"
import { LOCATION_STATUS } from "@/utils/constants"
import { formatTimestamp } from "@/utils/time"
import OtherInfoModify from "./OtherInfoModify"
import { Button } from "antd"
import { Typography } from "antd";
import QuillEditor from "@/components/QuillEditor"
import { useEffect, useState } from "react"
import Avatar from "@/components/Avatar"
import { FaEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import { extractYouTubeVideoId } from "@/utils/extract"
const { Title } = Typography;

const BoxInfo = ({
  data, 
  isModify, 
  widthPage, 
  tab, 
  hasModify
}) => {
  const [styleParent, setStyleParent] = useState({}) 

  useEffect(() => {
    let style = {};
    if(isModify) {
      if(widthPage <= 1288) {
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
  }, [isModify, widthPage]);
  return (
    <div>
      {data !== null && <div style={styleParent}>
        <Title style={{padding: "0 8px"}} level={5}>{isModify? "Thông tin chỉnh sửa" : "Thông tin gốc"}</Title>
        {/* Thông tin chính */}
        <div style={{display: "flex", gap: 8, padding: "0 16px"}}>
          <div>
            <Avatar linkImage={data?.avatar}/>
            <Title level={5} style={{textAlign: "center"}}>Ảnh đại diện</Title>
          </div>
          <div style={{flex: 1}}>
            {data.videoTutorial ? 
              <div style={{width: "100%"}}>
                <iframe width={"100%"} height={210} src={"https://www.youtube.com/embed/" + extractYouTubeVideoId(data.videoTutorial) + "?si=OAXSDfqe1vpf02LQ"} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" ></iframe>
                <Title level={5} style={{textAlign: "center"}}>Video giới thiệu</Title>
              </div> 
              : <div>
                  <div style={{height: 210, display: "flex", alignItems: "center", justifyContent: "center"}}>Không tìm thấy video giới thiệu</div>
                  <Title level={5} style={{textAlign: "center"}}>Video giới thiệu</Title>
              </div>}
          </div>
        </div>
        <div className="box-ticket-detail">
          <BoxTextField label="Tên địa điểm" value={data.name} disabled={true} colorGray={false} key={"tdd"}/>
          <BoxTextField label={<span>Toạ độ {data.linkGoogleMap && <a href={data.linkGoogleMap} target="_blank" rel="noreferrer">google map</a>}</span>} value={data.coordinates ? `${data.coordinates?.x} x ${data.coordinates?.y}` : null} disabled={true} colorGray={false} key={"tđ"}/>
          <BoxTextField label="Lần chỉnh sửa" value={data.modifyCount} disabled={true} colorGray={false} key={"lcs"}/>
          <BoxTextField label="Sức chứa" value={data.capacity} disabled={true} colorGray={false} key={"sc"}/>
          <BoxTextField label="Mở cửa lúc" value={formatTimestamp(data.openTime, "HH:mm", true)} disabled={true} colorGray={false} key={"mc"}/>
          <BoxTextField label="Đóng cửa lúc" value={formatTimestamp(data.closeTime, "HH:mm", true)} disabled={true} colorGray={false} key={"đc"}/>
          <BoxTextField label="Ngày đi vào hoạt động" value={formatTimestamp(data.openDate, "DD/MM/YYYY", false)} disabled={true} colorGray={false} key={"nđvhđ"}/>
          <BoxTextField label="Trạng thái" value={data.status !== 1 ? LOCATION_STATUS[data.status].label : data.id ? "Chờ áp dụng" : LOCATION_STATUS[data.status].label} disabled={true} colorGray={false} key={"tt"}/>
          {data.locationId && <BoxTextField label="Lý do thay đổi trạng thái" value={data.reason} disabled={true} colorGray={false} key={"ldtđtt"}/>}
          
        </div>
        {/* checkbox */}
        <div>
          <BoxCheckBox label={"Mở cửa ngày lễ"} checked={data.openHoliday}/>
        </div>
        <div>
          <QuillEditor style={{margin: 10}} value={data.description} readonly={true} key={"description"}/>
        </div>
        {isModify && [3, 4, 5].includes(tab) && 
        <div>
          <div style={{margin: "40px 0"}}>
            <OtherInfoModify data={data} />
          </div>
        </div> }
        {!hasModify && !isModify && 
        <div>
          <div style={{ display: "flex", justifyContent: "center", padding: "0 16px", margin: "80px 0" }}>
            <Link to={"/partner/location/edit/" + (data.id ? data.id : (data.modifyId ? data.modifyId : data.locationId))}>
              <Button color="primary" variant="solid" style={{margin: "0 8px"}}>
                <FaEdit />
                Chỉnh sửa
              </Button>
            </Link>
          </div>
        </div> }
      </div>}
    </div>
  )
}

export default BoxInfo
