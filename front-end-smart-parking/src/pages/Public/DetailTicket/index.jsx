import ChildContent from '@/components/layout/Customer/ChildContent'
import { useLoading } from '@/hook/loading'
import { customerTicketDetail } from '@/service/ticketService'
import { getDataApi } from '@/utils/api'
import { VEHICLE } from '@/utils/constants'
import { isNullOrUndefined } from '@/utils/data'
import { formatCurrency } from '@/utils/number'
import { toastError } from '@/utils/toast'
import hour from '@image/1-hour.png'
import day from '@image/24-hours.png'
import month from '@image/30-days.png'
import week from '@image/7-days.png'
import { Button, Flex, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Location from './Location'
import './style.css'
import ticketIcon from './tickets.png'
const getPrice = (price) => {
  return <Tooltip title={price.toString().length > 7 ? formatCurrency(price) : undefined}>{formatCurrency(price)}</Tooltip>
}
const DetailTicket = () => {
  const { id } = useParams();
  const [locationChoosed, setLocationChoosed] = React.useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { hideLoad, showLoad } = useLoading();

  useEffect(() => {
    showLoad({ type: 2 });
    customerTicketDetail(id).then((response) => {
      const data = getDataApi(response);
      setData(data);
    })
      .catch((e) => {
        const error = getDataApi(e);
        toastError(error.message);
      })
      .finally(() => {
        hideLoad();
      });
  }, [])

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
                <h2 className='upper'>{data?.name}</h2>
                <div>Phương tiện: {!isNullOrUndefined(data?.vehicle) && VEHICLE[data.vehicle].label}</div>
              </div>
              <Flex className='price-wrapper'>
                <div className='price'>
                  <Flex className='price-item' align='center'>
                    <img src={hour} alt="hour" />
                    {data?.priceTimeSlot ?
                      <span>
                        <span className='price-slot'>
                          {getPrice(data.priceTimeSlot)}
                        </span>
                        <sup> Đ</sup>/Giờ
                      </span> : <span className='price-slot'>--</span>}
                  </Flex>
                  <Flex className='price-item' align='center'>
                    <img src={day} alt="day" />
                    {data?.priceDaySlot ?
                      <span>
                        <span className='price-slot'>
                          {getPrice(data.priceDaySlot)}
                        </span>
                        <sup> Đ</sup>/Ngày
                      </span> : <span className='price-slot'>--</span>}
                  </Flex>
                </div>
                <div className='price'>
                  <Flex className='price-item' align='center'>
                    <img src={week} alt="week" />
                    {data?.priceWeekSlot ?
                      <span>
                        <span className='price-slot'>
                          {getPrice(data.priceWeekSlot)}
                        </span>
                        <sup> Đ</sup>/Tuần
                      </span> : <span className='price-slot'>--</span>}
                  </Flex>
                  <Flex className='price-item' align='center'>
                    <img src={month} alt="month" />
                    {data?.priceMonthSlot ?
                      <span>
                        <span className='price-slot'>
                          {getPrice(data.priceMonthSlot)}
                        </span>
                        <sup> Đ</sup>/Tháng
                      </span> : <span className='price-slot'>--</span>}
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
      <Location onChooseLocation={onChooseLocation} ticketId={id}/>
    </div>
  )
}

export default DetailTicket
