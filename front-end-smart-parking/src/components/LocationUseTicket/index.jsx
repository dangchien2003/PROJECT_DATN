import { useLoading } from "@/hook/loading";
import { getListDetail } from "@/service/locationService";
import { getDataApi } from "@/utils/api";
import { isNullOrUndefined } from "@/utils/data";
import { toastError } from "@/utils/toast";
import { Avatar, Button, Empty, List } from "antd";
import { useEffect, useState } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import ModalCustom from "../ModalCustom";
import Map from "../Map";

const convertDataMap = (data = []) => {
  return data.filter(item => !isNullOrUndefined(item.coordinates)).map((item) => {
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

const LocationUseTicket = ({ ids }) => {
  const [data, setData] = useState([]);
  const { showLoad, hideLoad } = useLoading();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (isNullOrUndefined(ids) || ids.length === 0) {
      return;
    }
    showLoad("Đang tải dữ liệu");
    getListDetail(ids).then((response) => {
      const result = getDataApi(response);
      setData(result);
    })
      .catch((error) => {
        const dataError = getDataApi(error);
        toastError(dataError?.message);
      })
      .finally(() => {
        hideLoad();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div style={{ margin: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className='label'>Địa điểm áp dụng:</span>
        {(!isNullOrUndefined(data) && data.length > 0) && <Button color="primary" variant="solid" style={{ margin: "0 8px" }} onClick={() => setShowMap(true)}>
          <FaMapMarkedAlt />
          Bản đồ
        </Button>}
      </div>
      <div style={{ border: "1px solid #d9d9d9", borderRadius: 4, margin: "8px 0", padding: "8px 16px", backgroundColor: "#f5f5f5" }}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          locale={{
            emptyText: <List
              itemLayout="horizontal"
              dataSource={data}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không tìm thấy dữ liệu" /> }}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href="https://ant.design">{item.name}</a>}
                    description={item.address}
                  />
                </List.Item>
              )}
            />
          }}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href="https://ant.design">{item.name}</a>}
                description={item.address}
              />
            </List.Item>
          )}
        />
      </div>
      {showMap && <ModalCustom onClose={() => setShowMap(false)}>
        <div>
          <Map data={convertDataMap(data)} style={{width: 800, height: 600}} />
        </div>
      </ModalCustom>
      }
    </div>
  )
}

export default LocationUseTicket
