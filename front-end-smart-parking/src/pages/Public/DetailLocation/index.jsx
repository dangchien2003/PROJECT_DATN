import ChildContent from '@/components/layout/Customer/ChildContent'
import Map from '@/components/Map'
import { useLoading } from '@/hook/loading'
import { getDataApi } from '@/utils/api'
import { convertDataMap } from '@/utils/data'
import { extractYouTubeVideoId } from '@/utils/extract'
import { geTimeAction, getUsedStatus } from '@/utils/location'
import { toastError } from '@/utils/toast'
import noImage from '@image/noImage.png'
import { Flex } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Recommend from './Recommend'
import './style.css'
import { customerDetail } from '@/service/locationService'

const DetailLocation = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const {showLoad, hideLoad} = useLoading();

  useEffect(() => {
    showLoad({type: 2});
    customerDetail(id).then((response) => {
      const data = getDataApi(response);
      setData(data);
    })
      .catch((e) => {
        const error = getDataApi(e);
        toastError(error.message)
      })
      .finally(() => {
        hideLoad();
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])
  return (
    <div id='detail-location'>
      <ChildContent backgroundColor='#f0f0f0'>
        <Flex className='info br3' gap={16}>
          <div className={data?.avatar ? 'image-wrapper' : 'image-wrapper no-image'}>
            <img src={data?.avatar ? data?.avatar : noImage} className='br3' alt='avatar'/>
          </div>
          <div className='detail'>
            <div className='text'>
              <h2>{data?.name}</h2>
              <div className='address'>
                Địa chỉ: {data?.address}
              </div>
              <div>{geTimeAction(data?.openTime, data?.closeTime, data?.openHoliday)}</div>
              <div>Sức chứa: {data?.capacity}</div>
              <div>{getUsedStatus(data?.capacity, data?.used)}</div>
            </div>
            <div>
              <Link to={"/choose/ticket/1"} className=''>
                <button className='btn-choose br3'>
                  <span>Chọn vé</span>
                </button>
              </Link>
            </div>
          </div>
        </Flex>
      </ChildContent>
      <ChildContent backgroundColor='#f0f0f0'>
        <Flex wrap="wrap" gap={16} className='box2'>
          <div className='description-wrapper '>
            <div className='title-box br3'>Giới thiệu</div>
            <div className='description br3 hide-scrollbar'>
              <div dangerouslySetInnerHTML={{ __html: data?.description }} />
            </div>
          </div>
          {data?.videoTutorial && <iframe width={"100%"} height={300} src={`https://www.youtube.com/embed/${extractYouTubeVideoId(data.videoTutorial)}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" />}
          <div className='map-wrapper'>
            <div className='title-box br3'>Vị trí</div>
            <Map className="map br3" data={data ? convertDataMap([data]) : []}/>
          </div>
        </Flex>
      </ChildContent>
      <ChildContent backgroundColor='#f0f0f0'>
      </ChildContent>
      {/* <ChildContent backgroundColor='#f0f0f0'>
        <div>Sơ đồ</div>
      </ChildContent> */}
      <ChildContent backgroundColor='#f0f0f0'>
        <div className='title-box br3'>Gợi ý cho bạn</div>
        <Recommend id={id}/>
      </ChildContent>
    </div>
  )
}

export default DetailLocation
