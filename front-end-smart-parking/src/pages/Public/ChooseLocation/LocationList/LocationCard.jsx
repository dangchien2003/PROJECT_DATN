import { FaCircleDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import noImage from '@image/noImage.png'

// Hoạt động từ 8 giờ 30 phút đến 22 giờ hằng ngày
const LocationCard = ({ data }) => {
  const geTimeAction = () => {
    var result = null
    if (data.openTime === data.closeTime) {
      if (data.openHoliday) {
        result = "Hoạt động 24/7";
      } else {
        result = "Hoạt động 24 giờ - không làm việc ngày lễ";
      }
    } else if (data.openTime !== data.closeTime) {
      const open = data.openTime.split(':');
      const close = data.closeTime.split(':');
      result = `Hoạt động từ ${open[0]} giờ ${open[1]} phút đến ${close[0]} giờ ${close[1]} phút`;
      if (!data.openHoliday) {
        result += " - không làm việc ngày lễ";
      }
    }
    return result;
  }

  const getUsedStatus = () => {
    var tiLe = Math.floor((data.used / data.capacity) * 100);
    if (tiLe <= 30) {
      return <div><FaCircleDot className='status level1' />Thưa thớt</div>
    } else if (tiLe <= 50) {
      return <div><FaCircleDot className='status level2' />Khá thưa thớt</div>
    } else if (tiLe <= 70) {
      return <div><FaCircleDot className='status level3' />Nhộn nhịp</div>
    } else if (tiLe <= 90) {
      return <div><FaCircleDot className='status level4' />Đông đúc</div>
    } else if (tiLe < 100) {
      return<div><FaCircleDot className='status level5' />Rất đông đúc</div>
    } else {
      return <div><FaCircleDot className='status level6' />Hết chỗ</div>
    }
  }
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
          <div>{geTimeAction()}</div>
          <div>Bãi gửi xe dịch vụ | Khu vui chơi giải trí | Trung tâm thương mại</div>
          <div>
            {getUsedStatus()}
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
