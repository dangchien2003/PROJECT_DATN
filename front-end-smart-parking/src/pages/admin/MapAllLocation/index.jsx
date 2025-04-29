import Map from "@/components/Map"
import { useLoading } from "@/hook/loading"
import { getMapLocation } from "@/service/locationService"
import { getDataApi } from "@/utils/api"
import { toastError } from "@/utils/toast"
import { useEffect, useState } from "react"
const convertDataMap = (data) => {
  return data.map((item) => {
    return {
      position: [item.coordinates?.x, item.coordinates?.y],
      popupContent: (
        <a
          href={item.linkGoogleMap}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "black", textDecoration: "none" }}
        >
          {item.name}
        </a>
      ),
    }
  })
}
const MapAllLocation = () => {
  const [page, setPage] = useState(0);
  const { hideLoad, showLoad } = useLoading();
  const [data, setData] = useState([]);

  const callApi = () => {
    let result = null;
    getMapLocation(page).then((response) => {
      console.log(response)
      result = getDataApi(response);
      // convert data thành dữ liệu bản đồ
      const newData = convertDataMap(result);
      // nối thêm data
      setData(pre => pre.concat(newData));
    })
      .catch((error) => {
        const dataError = getDataApi(error);
        toastError(dataError?.message)
      })
      .finally(() => {
        hideLoad();
        if (result) {
          if(result.getTotalPage > page + 1) {
            setPage(page + 1);
          }
        }
      })
  }

  useEffect(() => {
    let timeOutId = null;
    if (page === 0) {
      showLoad("Đang tải vị trí");
      callApi();
    } else {
      // delay
      timeOutId = setTimeout(() => {
        callApi();
      }, 1000);
    }
    return () => {
      clearTimeout(timeOutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])
  return (
    <div style={{ height: "100%" }}>
      <Map data={data} key={"mapAll"} style={{ height: "100%" }} />
    </div>
  )
}

export default MapAllLocation
