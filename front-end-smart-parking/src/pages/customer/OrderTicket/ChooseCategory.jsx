import React from 'react'
import hour from '@image/1-hour.png'
import day from '@image/24-hours.png'
import week from '@image/7-days.png'
import month from '@image/30-days.png'
import './style.css'
import { Flex } from 'antd';
import { PRICE_CATEGORY } from '@/utils/constants';

const ChooseCategory = ({ onChooseItem, category }) => {
  const handleClickItem = (item) => {
    if (onChooseItem) {
      onChooseItem(item);
    }
  }
  return (
    <div>
      <h2>Chọn mệnh giá</h2>
      <Flex className='price-wrapper' justify='center'>
        <Flex className={category === PRICE_CATEGORY.TIME.value ? "price-item choose" : "price-item"} onClick={() => { handleClickItem(PRICE_CATEGORY.TIME.value) }}>
          <img src={hour} alt="hour" />
          <span>24.000<sup>Đ</sup>/giờ</span>
        </Flex>
        <Flex className={category === PRICE_CATEGORY.DAY.value ? "price-item choose" : "price-item"} onClick={() => { handleClickItem(PRICE_CATEGORY.DAY.value) }}>
          <img src={day} alt="day" />
          <span>24.000<sup>Đ</sup>/ngày</span>
        </Flex>
        <Flex className={category === PRICE_CATEGORY.WEEK.value ? "price-item choose" : "price-item"} onClick={() => { handleClickItem(PRICE_CATEGORY.WEEK.value) }}>
          <img src={week} alt="week" />
          <span>24.000<sup>Đ</sup>/tuần</span>
        </Flex>
        <Flex className={category === PRICE_CATEGORY.MONTH.value ? "price-item choose" : "price-item"} onClick={() => { handleClickItem(PRICE_CATEGORY.MONTH.value) }}>
          <img src={month} alt="month" />
          <span>24.000<sup>Đ</sup>/tháng</span>
        </Flex>
      </Flex>
    </div>
  )
}

export default ChooseCategory
