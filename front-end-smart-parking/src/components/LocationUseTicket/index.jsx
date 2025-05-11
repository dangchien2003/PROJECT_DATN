import { useLoading } from "@/hook/loading";
import { getListDetail } from "@/service/locationService";
import { getDataApi } from "@/utils/api";
import { isNullOrUndefined } from "@/utils/data";
import { toastError } from "@/utils/toast";
import { Avatar, Empty, List } from "antd";
import { useEffect, useState } from "react";

const LocationUseTicket = ({ids}) => {
  const [data, setData] = useState([]);
  const {showLoad, hideLoad} = useLoading();

  useEffect(() => {
    if(isNullOrUndefined(ids) || ids.length === 0) {
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
      <span className='label'>Địa điểm áp dụng:</span>
      <div style={{ border: "1px solid #d9d9d9", borderRadius: 4, margin: "8px 0", padding: "8px 16px", backgroundColor: "#f5f5f5" }}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          locale={{ emptyText:   <List
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
          /> }}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href="https://ant.design">{item.name}</a>}
                description={item.address}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export default LocationUseTicket
