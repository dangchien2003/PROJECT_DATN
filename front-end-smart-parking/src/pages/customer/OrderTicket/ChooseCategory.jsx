import React, { useEffect, useState } from 'react'
import hour from '@image/1-hour.png'
import day from '@image/24-hours.png'
import week from '@image/7-days.png'
import month from '@image/30-days.png'
import './style.css'
import { Flex } from 'antd';
import { lineLoading, PRICE_CATEGORY } from '@/utils/constants';
import { customerTicketDetail } from '@/service/ticketService'
import { getDataApi } from '@/utils/api'
import { toastError } from '@/utils/toast'
import { useParams } from 'react-router-dom'
import { formatCurrency } from '@/utils/number'
import { useLoading } from '@/hook/loading'

const ChooseCategory = ({ onChooseItem, onLoadTicket, category }) => {
  const { id } = useParams();
  const [ticket, setTicket] = useState({});
  const { showLoad, hideLoad } = useLoading();

  useEffect(() => {
    showLoad(lineLoading);
    customerTicketDetail(id).then((response) => {
      const data = getDataApi(response);
      setTicket(data);
      onLoadTicket(data)
    })
    .catch((e) => {
      const response = getDataApi(e);
      toastError(response.message);
    })
    .finally(() => {
      hideLoad();
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])

  useEffect(() => {
    if (ticket) {
      if (ticket.priceTimeSlot) {
        onChooseItem(PRICE_CATEGORY.TIME.value);
      } else if (ticket.priceDaySlot) {
        onChooseItem(PRICE_CATEGORY.DAY.value);
      } else if (ticket.priceWeekSlot) {
        onChooseItem(PRICE_CATEGORY.WEEK.value);
      } else if (ticket.priceMonthSlot) {
        onChooseItem(PRICE_CATEGORY.MONTH.value);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [ticket])

  const handleClickItem = (item) => {
    if (onChooseItem) {
      onChooseItem(item);
    }
  }
  return (
    <div>
      <h2>Chọn mệnh giá</h2>
      <Flex className='price-wrapper' justify='center'>
        <Flex className={category === PRICE_CATEGORY.TIME.value ? "price-item choose" : "price-item"} onClick={ticket.priceTimeSlot ? () => { handleClickItem(PRICE_CATEGORY.TIME.value) } : null}>
          <img src={hour} alt="hour" />
          {ticket.priceTimeSlot ? <span>{formatCurrency(ticket.priceTimeSlot)}<sup>Đ</sup>/giờ</span> : <span>--</span>}
        </Flex>
        <Flex className={category === PRICE_CATEGORY.DAY.value ? "price-item choose" : "price-item"} onClick={ticket.priceDaySlot ? () => { handleClickItem(PRICE_CATEGORY.DAY.value) } : null}>
          <img src={day} alt="day" />
          {ticket.priceDaySlot ? <span>{formatCurrency(ticket.priceDaySlot)}<sup>Đ</sup>/ngày</span> : <span>--</span>}
        </Flex>
        <Flex className={category === PRICE_CATEGORY.WEEK.value ? "price-item choose" : "price-item"} onClick={ticket.priceWeekSlot ? () => { handleClickItem(PRICE_CATEGORY.WEEK.value) } : null}>
          <img src={week} alt="week" />
          {ticket.priceWeekSlot ? <span>{formatCurrency(ticket.priceWeekSlot)}<sup>Đ</sup>/tuần</span> : <span>--</span>}
        </Flex>
        <Flex className={category === PRICE_CATEGORY.MONTH.value ? "price-item choose" : "price-item"} onClick={ticket.priceMonthSlot ? () => { handleClickItem(PRICE_CATEGORY.MONTH.value) } : null}>
          <img src={month} alt="month" />
          {ticket.priceMonthSlot ? <span>{formatCurrency(ticket.priceMonthSlot)}<sup>Đ</sup>/tháng</span> : <span>--</span>}
        </Flex>
      </Flex>
    </div>
  )
}

export default ChooseCategory
