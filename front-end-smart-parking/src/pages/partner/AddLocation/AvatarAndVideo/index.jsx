import BoxUploadImage from "@/components/BoxUploadImage"
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { extractYouTubeVideoId } from "@/utils/extract";
import { updateObjectValue } from "@/utils/object";
import { Typography } from "antd";
import { useState } from "react";
const { Title } = Typography;

const dataAdd = {}
const AvatarAndVideo = () => {
  const [linkVideo, setLinkVideo] = useState(null)
  const [idVideo, setIdVideo] = useState(null)

  const handleChange = (value, key) => {
    console.log(value)
    if (dataAdd) {
      updateObjectValue(dataAdd, key, value);
      setLinkVideo(value)
      setIdVideo(extractYouTubeVideoId(value))
    }
  };
  return (
    <div>
      <div style={{display: "flex", gap: 8, padding: "0 16px"}}>
        <div>
          <BoxUploadImage/>
          <Title level={5} style={{textAlign: "center"}}>Ảnh đại diện</Title>
        </div>
        <div style={{flex: 1}}>
          {idVideo ? 
            <>
              <div style={{width: "100%"}}>
                <iframe width={"100%"} height={210} src={"https://www.youtube.com/embed/" + idVideo + "?si=OAXSDfqe1vpf02LQ"} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" ></iframe>
                <Title level={5} style={{textAlign: "center"}}>Video giới thiệu</Title>
              </div> 
              <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <TextFieldLabelDash label={"Đường dẫn youtube giới thiệu"} placeholder={"Nhập đường dẫn"} itemKey={"videogt"} key={"videogt"} callbackChangeValue={handleChange} defaultValue={linkVideo}/>
              </div>
            </>
            :
              <div style={{width: "100%", height: 210, display: "flex", justifyContent: "center", alignItems: "center"}}>
                <TextFieldLabelDash label={"Đường dẫn youtube giới thiệu"} placeholder={"Nhập đường dẫn"} itemKey={"videogt"} key={"videogt"} callbackChangeValue={handleChange} defaultValue={linkVideo}/>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default AvatarAndVideo
