import LoadingComponent from '@/components/LoadingComponent'
import Map from '@/components/Map'
import { customerGetLocationUseTicket } from '@/service/ticketService'
import { getDataApi } from '@/utils/api'
import { convertDataMap, isNullOrUndefined } from '@/utils/data'
import { toastError } from '@/utils/toast'
import { List, Tooltip } from 'antd'
import Search from 'antd/es/input/Search'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { useParams, useSearchParams } from 'react-router-dom'

const Location = ({ onChooseLocation }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();
  const locationFromParam = searchParams.get("locationChoosed");

  const handleClickLocation = (item) => {
    if (onChooseLocation) {
      onChooseLocation(item);
    }
  }

  // lấy thông tin địa điểm đã chọn trước đó
  useEffect(() => {
    if(data.length > 0 && !isNullOrUndefined(locationFromParam) && locationFromParam !== "" && !selected) {
      for(var location of data) {
        if(location.locationId === Number(locationFromParam) && onChooseLocation) {
          onChooseLocation(location);
          setSelected(location);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [data, locationFromParam])

  useEffect(() => {
    customerGetLocationUseTicket(0, 5, id).then((response) => {
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
  }, [id])
  return (
    <>
      <div className='list-locaiton-wrapper'>
        <h2>Chọn địa điểm</h2>
        <div className='list-locaiton br3 pr'>
          {!loading ?
            <div className='scroll'>
              <div className='search'>
                <Search className='input' placeholder="Tìm kiếm địa điểm"
                  enterButton={
                    <Tooltip title="Tìm kiếm">
                      <span>
                        <FaSearch />
                      </span>
                    </Tooltip>} />
              </div>
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                  <List.Item
                    onClick={() => {
                      if (onChooseLocation) {
                        handleClickLocation(item);
                      }
                      setSelected(item);
                    }}
                    actions={[
                      selected?.locationId === item.locationId ? <IoCheckmarkDoneOutline fontSize={20} color="#52c41a" /> : null
                    ]}
                  >
                    <List.Item.Meta
                      title={<div>{item.name}</div>}
                      description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                    />
                  </List.Item>
                )}
              />
            </div> : <LoadingComponent transparent />}
        </div>
      </div>
      <Map className="map" focus={selected} data={data} />
    </>
  )
}

export default Location
