import BoxUploadImage from "@/components/BoxUploadImage"
import TextFieldLabelDash from "@/components/TextFieldLabelDash";
import { extractYouTubeVideoId } from "@/utils/extract";
import { updateObjectValue } from "@/utils/object";
import { Typography } from "antd";
import { useEffect, useState } from "react";
const { Title } = Typography;

const AvatarAndVideo = ({data}) => {
  const [linkVideo, setLinkVideo] = useState(null)
  const [idVideo, setIdVideo] = useState(null)
  useEffect(()=> {
    if(data?.videoTutorial) {
      setLinkVideo(data?.videoTutorial)
      setIdVideo(extractYouTubeVideoId(data?.videoTutorial))
    }
  }, [data])
  const handleChange = (key, value) => {
    if (data) {
      updateObjectValue(data, key, value);
    }
    setLinkVideo(value)
    setIdVideo(extractYouTubeVideoId(value))
  };
  const inputVideo = <TextFieldLabelDash 
                      label={"Đường dẫn youtube giới thiệu"} 
                      placeholder={"Nhập đường dẫn"} 
                      itemKey={"videoTutorial"} 
                      key={"videogt"} 
                      callbackChangeValue={handleChange} 
                      defaultValue={linkVideo}
                    />
  return (
    <div>
      <div style={{display: "flex", gap: 8, padding: "0 16px"}}>
        <div>
          <BoxUploadImage image={data?.avatar}/>
          <Title level={5} style={{textAlign: "center"}}>Ảnh đại diện</Title>
        </div>
        {/* video */}
        <div style={{flex: 1}}>
          {idVideo ? 
            <>
              <div style={{width: "100%"}}>
                <iframe width={"100%"} height={210} src={"https://www.youtube.com/embed/" + idVideo + "?si=OAXSDfqe1vpf02LQ"} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" ></iframe>
                <Title level={5} style={{textAlign: "center"}}>Video giới thiệu</Title>
              </div> 
              <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                {inputVideo}
              </div>
            </>
            :
              <div style={{width: "100%", height: 210, display: "flex", justifyContent: "center", alignItems: "center"}}>
                {inputVideo}
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default AvatarAndVideo
