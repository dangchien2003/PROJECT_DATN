import { geTimeAction, getUsedStatus } from '@/utils/location'
import noImage from '@image/noImage.png'
import { Link } from 'react-router-dom'

// Hoạt động từ 8 giờ 30 phút đến 22 giờ hằng ngày
const LocationCard = ({ data }) => {
  
  return (
    <div className='location-card br3'>
      <div className='info'>
        <div className='avatar'>
          <img className='br3' src={data.avatar ? data.avatar : noImage} alt="image-location" />
        </div>
        <div className='detail'>
          <Link to={"/location/" + data.locationId}>
            <h3 className='name'>{data.name}</h3>
          </Link>
          <a className='address' target='_blank' rel="noreferrer" href={data.linkGoogleMap}>
            Địa chỉ: {data.address}
          </a>
          <div>Đơn vị phát hành: {data.partnerName}</div>
          <div>{geTimeAction(data.openTime, data.closeTime, data.openHoliday)}</div>
          <div>Bãi gửi xe dịch vụ | Khu vui chơi giải trí | Trung tâm thương mại</div>
          <div>
            {getUsedStatus(data.capacity, data.used)}
          </div>
        </div>
      </div>
      <Link to={`/choose/ticket/${data.locationId}?name=${data.name}&partner=${data.partnerName}`} className=''>
        <button className='btn-choose'>
          <span>Tiếp tục</span>
        </button>
      </Link>
    </div>
  )
}

export default LocationCard
