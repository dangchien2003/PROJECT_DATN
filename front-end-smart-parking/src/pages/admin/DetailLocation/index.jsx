import { useLoading } from "@/hook/loading";
import { useSelectMenu } from "@/hook/useSelectMenu";
import { locationDetail, modifyDetail } from "@/service/locationService";
import { getDataApi } from "@/utils/api";
import { MENU_ADMIN_ID } from "@/utils/constants";
import { toastError } from "@/utils/toast";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoxInfo from "./BoxInfo";
import "./style.css";
const { Title } = Typography;

const DetailLocation = () => {
  const { tab, id } = useParams();
  const tabNumber = Number(tab);
  const { select } = useSelectMenu();

  useEffect(() => {
    if ([1, 2, 6].includes(tabNumber)) {
      select(MENU_ADMIN_ID.DIA_DIEM_DANH_SACH);
    } else {
      select(MENU_ADMIN_ID.DIA_DIEM_CHO_DUYET);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const [styleParent, setStyleParent] = useState({})
  const [widthPage, setWidthPage] = useState(window.innerWidth)
  const [dataModify, setDataModify] = useState(null)
  const [dataRoot, setDataRoot] = useState(null)
  const { showLoad, hideLoad } = useLoading();
  // hàm lấy dữ liệu 
  const getDataRoot = (id) => {
    locationDetail(id).then((response) => {
      const result = getDataApi(response);
      setDataRoot(result)
    })
      .catch((error) => {
        const dataError = getDataApi(error);
        toastError(dataError?.message)
      })
      .finally(() => {
        hideLoad()
      })
  }

  const getDataModify = (id) => {
    modifyDetail(id).then((response) => {
      const result = getDataApi(response);
      setDataModify(result);
      return result.locationId;
    })
      .catch((error) => {
        const dataError = getDataApi(error);
        toastError(dataError?.message)
      })
      .finally(() => {
        hideLoad()
      })
  }
  useEffect(() => {
    // xử lý
    showLoad("Đang tải dữ liệu");
    // 1: đang hoạt động, 2: tạm dừng hoạt động, 3: Chờ duyệt, 4: từ chối 5: chờ áp dụng 6: ngưng hoạt động
    if ([1, 2, 6].includes(tabNumber)) {
      getDataRoot(id);
    }

    if ([3, 4, 5].includes(tabNumber)) {
      getDataModify(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabNumber, id]);

  useEffect(() => {
    if (dataModify?.locationId) {
      getDataRoot(dataModify.locationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [dataModify])

  // responsive
  useEffect(() => {
    const handleResize = () => {
      let style = {};
      if (window.innerWidth <= 1288 || !dataModify) {
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
  }, [dataModify, dataRoot]);

  return (
    <div>
      <Title level={4}
        style={{
          marginBottom: 16,
          borderBottom: "1px solid rgb(185, 183, 183)",
          display: "inline-block"
        }}
      >Thông tin địa điểm: {dataRoot && dataRoot?.id !== null ? dataRoot?.id : dataModify?.modifyId} - Quản lý bởi: {dataRoot && dataRoot?.partnerName !== null ? dataRoot?.partnerName : dataModify?.partnerName}</Title>
      <div className={dataModify && "modify"}>
        <div style={styleParent}>
          <BoxInfo data={dataRoot} isModify={false} widthPage={widthPage} tab={tabNumber} />
        </div>
        {dataModify && <div style={styleParent}>
          <BoxInfo data={dataModify} isModify={true} widthPage={widthPage} tab={tabNumber} />
        </div>}
      </div>
    </div>
  )
}

export default DetailLocation
