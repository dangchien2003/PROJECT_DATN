import { useParams } from "react-router-dom"
import "./style.css"
import BoxInfo from "./BoxInfo";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useLoading } from "@/hook/loading";
import { detail, detailWaitRelease } from "@/service/ticketService";
import { getDataApi } from "@/utils/api";
import { isNullOrUndefined } from "@/utils/data";
import { toastError } from "@/utils/toast";
const { Title } = Typography;

const DetailTicket = () => {
  const [styleParent, setStyleParent] = useState({})
  const [widthPage, setWidthPage] = useState(window.innerWidth)
  const [dataRelease, setDataRelease] = useState(null)
  const [dataRoot, setDataRoot] = useState(null)
  const [partnerName, setPartnerName] = useState(null)
  const { showLoad, hideLoad } = useLoading();
  const {isWaitRelease, id} = useParams();
  const isWaitReleaseBool = Number(isWaitRelease) === 1;

  const getDataRoot = (id) => {
    detail(id).then((response) => {
      const data = getDataApi(response);
      setDataRoot(data);
      setPartnerName(data?.partnerName);
    })
    .catch((error) => {
      const dataError = getDataApi(error);
      toastError(dataError?.message);
    })
    .finally(() => {
      hideLoad();
    });
  }

  const getDataRelease = () => {
    detailWaitRelease(id).then((response) => {
      const data = getDataApi(response);
      setDataRelease(data);
      setPartnerName(data?.partnerName);
      if(!isNullOrUndefined(data?.ticketId)) {
        getDataRoot(data.ticketId);
      }
    })
    .catch((error) => {
      const dataError = getDataApi(error);
      toastError(dataError?.message);
    })
    .finally(() => {
      hideLoad();
    });
  }
  // lấy dữ liệu
  useEffect(() => {
    // xử lý
    showLoad("Đang tải dữ liệu");
    if(isWaitReleaseBool) {
      getDataRelease();
    } else {
      getDataRoot(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // responsive
  useEffect(() => {
    const handleResize = () => {
      let style = {};
      if (window.innerWidth <= 1288 || !dataRelease) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRelease, dataRoot]);
  return (
    <div>
      <Title level={4} 
        style={{
          marginBottom: 16, 
          borderBottom: "1px solid rgb(185, 183, 183)",
          display: "inline-block"
        }}
        >Thông tin vé: {id} - của đối tác: {partnerName}</Title>
      <div className = {dataRelease && "modify"}>
        <div style={styleParent}>
          <BoxInfo data={dataRoot} isWaitApprove={false} widthPage={widthPage} />
        </div>
        {dataRelease && <div style={styleParent}>
          <BoxInfo data={dataRelease} isWaitApprove={true} widthPage={widthPage}/>
        </div>}
      </div>
    </div>
  )
}

export default DetailTicket
