import { VEHICLE } from '@/utils/constants';
import { formatCurrency } from '@/utils/number';
import bgTicket from '@image/cut2.png';
import { Button, Flex, Radio, Tooltip } from 'antd';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const TicketCard = ({ data }) => {
  const ref = useRef();
  const handleClickOrder = () => {
    alert("đặt vé")
  }

  const order = "Đặt vé";
  const view = "Xem";
  return (
    <div className='ticket-card br3 pr' ref={ref}>
      <img src={bgTicket} alt="bgbg" className='background' />
      <div className="content-card">
        <h3 className='name'>
          {data.name}
        </h3>
        <Flex justify='center' gap={24}>
          <div>
            <Radio checked={data.priceTimeSlot}>Giờ</Radio>
            {
              data.priceTimeSlot && <Tooltip title={<div>{formatCurrency(data.priceTimeSlot)} <sup>Đ</sup>/Giờ</div>}>
                <div>{formatCurrency(data.priceTimeSlot)} <sup>Đ</sup></div>
              </Tooltip>
            }
          </div>
          <div>
            <Radio checked={data.priceDaySlot}>Ngày</Radio>
            {
              data.priceDaySlot && <Tooltip title={<div>{formatCurrency(data.priceDaySlot)} <sup>Đ</sup>/Ngày</div>}>
                <div>{formatCurrency(data.priceDaySlot)} <sup>Đ</sup></div>
              </Tooltip>
            }
          </div>
          <div>
            <Radio checked={data.priceWeekSlot}>Tuần</Radio>
            {
              data.priceWeekSlot && <Tooltip title={<div>{formatCurrency(data.priceWeekSlot)} <sup>Đ</sup>/Tuần</div>}>
                <div>{formatCurrency(data.priceWeekSlot)} <sup>Đ</sup></div></Tooltip>
            }
          </div>
          <div>
            <Radio checked={data.priceMonthSlot}>Tháng</Radio>
            {
              data.priceMonthSlot && <Tooltip title={<div>{formatCurrency(data.priceMonthSlot)} <sup>Đ</sup>/Tháng</div>}>
                <div>{formatCurrency(data.priceMonthSlot)} <sup>Đ</sup></div></Tooltip>
            }
          </div>
        </Flex>
        <div>Phương tiện sử dụng: {VEHICLE[data.vehicle].icon} {VEHICLE[data.vehicle].name}</div>
        <div>{data.countLocation && data.countLocation > 0 ? `Sử dụng tại ${data.countLocation - 1} địa điểm khác` : "Chưa hỗ trợ sử dụng ở địa điểm khác"}</div>
        <div className='action'>
          <Link to={"/ticket/1"}>
            <Button type='primary' className="animated-btn">{view.split('').map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}</Button>
          </Link>
          <Button color="danger" variant="solid" className="animated-btn" onClick={handleClickOrder}>{order.split('').map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}</Button>
        </div>
      </div>
    </div>
  )
}

export default TicketCard
