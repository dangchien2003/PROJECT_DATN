import React from 'react'
import { FaCircleDot } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const LocationCard = () => {
  return (
    <div className='location-card br3'>
      <div className='info'>
        <div>
          <img className='br3' src="https://aeonmall-vietnam.com/wp-content/uploads/2017/01/makuhari_ground1-1.jpg" alt="image-location" />
        </div>
        <div className='detail'>
          <Link to={"/location/1"}><h3 className='name'>EAON MALL Hà Đông</h3></Link>
          <div className='address'>
            Địa chỉ: AEON MALL Long Biên, Số 27 đường Cổ Linh, Phường Long Biên, Quận Long Biên, Hà Nội
          </div>
          <div>Đơn vị phát hành: EAON MALL GROUP</div>
          <div>Hoạt động từ 8 giờ 30 phút đến 22 giờ hằng ngày</div>
          <div>Bãi gửi xe dịch vụ | Khu vui chơi giải trí | Trung tâm thương mại</div>
          <div><FaCircleDot className='status' />Đang đông đúc</div>
        </div>
      </div>
      <Link to={"/choose/ticket/1"} className=''>
        <button className='btn-choose'>
          <span>Tiếp tục</span>
        </button>
      </Link>
    </div>
  )
}

export default LocationCard
