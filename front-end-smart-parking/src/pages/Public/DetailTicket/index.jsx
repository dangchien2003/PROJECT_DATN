import ChildContent from '@/components/layout/Customer/ChildContent'
import { Button, Flex } from 'antd'
import React from 'react'
import ticketIcon from './tickets.png'
import hour from '@image/1-hour.png'
import day from '@image/24-hours.png'
import week from '@image/7-days.png'
import month from '@image/30-days.png'
import './style.css'
import { FaCarAlt } from 'react-icons/fa'
import Location from './Location'
import { Link, useParams } from 'react-router-dom'
import { isNullOrUndefined } from '@/utils/data'

const DetailTicket = () => {
  const {id} = useParams();
  const [locationChoosed, setLocationChoosed] = React.useState(null);

  const onChooseLocation = (location) => {
    setLocationChoosed(location);
  }
  return (
    <div id='detail-ticket'>
      <ChildContent backgroundColor='#f0f0f0'>
        <Flex justify='center'>
          <Flex className='info br3' gap={24}>
            <div className='image-wrapper'>
              <img src={ticketIcon} alt="ảnh địa điểm" className='br3' />
            </div>
            <div className='detail'>
              <div className='text'>
                <h2>Eaon mall hà đông</h2>
                <div>Phương tiện: <FaCarAlt /> Dành cho ô tô</div>
              </div>
              <Flex className='price-wrapper'>
                <div className='price'>
                  <Flex className='price-item'>
                    <img src={hour} alt="hour" />
                    <span>24.000<sup>Đ</sup>/giờ</span>
                  </Flex>
                  <Flex className='price-item'>
                    <img src={day} alt="day" />
                    <span>24.000<sup>Đ</sup>/ngày</span>
                  </Flex>
                </div>
                <div className='price'>
                  <Flex className='price-item'>
                    <img src={week} alt="week" />
                    <span>24.000<sup>Đ</sup>/tuần</span>
                  </Flex>
                  <Flex className='price-item'>
                    <img src={month} alt="month" />
                    <span>24.000<sup>Đ</sup>/tháng</span>
                  </Flex>
                </div>
              </Flex>
              <Link to={`/order/${id}?locationChoosed=${!isNullOrUndefined(locationChoosed?.id) ? locationChoosed?.id : ''}`}>
                <Button className='order' color="danger" variant="solid">ĐẶT VÉ NGAY</Button>
              </Link>
              {locationChoosed && <div className='location-choosed'>Bạn đang đặt vé cho địa điểm: <b>{locationChoosed.name}</b></div>}
            </div>
          </Flex>
        </Flex>
      </ChildContent>
      <Location onChooseLocation={onChooseLocation}/>
    </div>
  )
}

export default DetailTicket
