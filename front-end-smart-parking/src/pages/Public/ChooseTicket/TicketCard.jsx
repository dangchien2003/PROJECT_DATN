import { useRef } from 'react'
import bgTicket from '@image/cut2.png'
import { Button, Flex, Radio, Tooltip } from 'antd'
import { FaMotorcycle } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const TicketCard = () => {
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
          Vé vip
        </h3>
        <Flex justify='center' gap={24}>
          <div>
            <Radio checked>Giờ</Radio>
            <Tooltip title={<div>1.000 <sup>Đ</sup>/Giờ</div>}>
              <div>1.000 <sup>Đ</sup></div>
            </Tooltip>
          </div>
          <div>

            <Radio checked>Ngày</Radio>
            <Tooltip title={<div>10.000 <sup>Đ</sup>/Ngày</div>}>
              <div>10.000 <sup>Đ</sup></div>
            </Tooltip>

          </div>
          <div>
            <Radio checked>Tuần</Radio>
            <Tooltip title={<div>50.000 <sup>Đ</sup>/Tuần</div>}>
              <div>50.000 <sup>Đ</sup></div></Tooltip>
          </div>
          <div>
            <Radio checked>Tháng</Radio>
            <Tooltip title={<div>150.000 <sup>Đ</sup>/Tháng</div>}>
              <div>150.000 <sup>Đ</sup></div></Tooltip>
          </div>
        </Flex>
        <div>Phương tiện sử dụng: <FaMotorcycle /> Xe máy</div>
        <div>Sử dụng tại 12 địa điểm khác</div>
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
