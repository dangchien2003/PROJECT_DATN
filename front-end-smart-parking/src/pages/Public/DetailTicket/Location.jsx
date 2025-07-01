import ChildContent from '@/components/layout/Customer/ChildContent'
import Map from '@/components/Map'
import { Flex, List, Tooltip } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { GiClick } from "react-icons/gi";
import { convertDataMap, isNullOrUndefined } from '@/utils/data'
import LoadingComponent from '@/components/LoadingComponent'
import { customerGetLocationUseTicket } from '@/service/ticketService'
import { getDataApi } from '@/utils/api'
import { toastError } from '@/utils/toast'

const Location = ({ onChooseLocation, ticketId }) => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const handleClickLocation = (item) => {
    if (onChooseLocation) {
      onChooseLocation(item);
    }
  }

  useEffect(() => {
    if (isNullOrUndefined(ticketId) || ticketId === "") {
      return;
    }

    customerGetLocationUseTicket(0, 5, ticketId).then((response) => {
      const dataResponse = getDataApi(response);
      const dataConvert = convertDataMap(dataResponse.data);
      setData(pre => [...pre, ...dataConvert]);
    })
    .catch((e) => {
      const error = getDataApi(e);
      toastError(error.message);
    })
    .finally(() => {
      setLoading(false);
    })
  }, [])
  return (
    <ChildContent backgroundColor='#f0f0f0' >
      <Flex wrap="wrap" gap={16} className='box2'>
        <div className='list-locaiton-wrapper'>
          <div className='title-box br3'>Địa điểm sử dụng</div>
          <div className='list-locaiton br3 pr'>
            {!loading ?
              <div style={{padding: "16px 32px"}}>
                <div>
                  Sử dụng tại <b>{data.length}</b> địa điểm khác nhau trên khắp cả nước
                </div>
                <div style={{ padding: "4px 0" }}><GiClick className='rainbow-text' /> Nhấn chọn vào địa điểm để xem vị trí</div>
                <div className='scroll'>
                  <div className='search '>
                    <Search className='input' placeholder="Tìm kiếm địa điểm" enterButton={
                      <Tooltip title="Tìm kiếm">
                        <span>
                          <FaSearch />
                        </span>
                      </Tooltip>} />
                  </div>
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item, index) => (
                      <List.Item
                        onClick={() => {
                          handleClickLocation(item);
                          setSelected(item);
                        }}
                        actions={[
                          selected?.locationId === item.locationId ? <IoCheckmarkDoneOutline fontSize={20} color="#52c41a" /> : null
                        ]}
                      >
                        <List.Item.Meta
                          title={<span>{item.name}</span>}
                          description={item.address}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </div> : <LoadingComponent transparent/>}
          </div>
        </div>
        <div className='map-wrapper'>
          <div className='title-box br3'>Bản đồ</div>
          <Map data={data} className="map br3" focus={selected?.position} />
        </div>
      </Flex>
    </ChildContent>

  )
}

export default Location
