import { VEHICLE } from '@/utils/constants';
import bgTicket from '@image/cut2.png';
import { Button } from 'antd';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const TicketCardMinimize = ({data}) => {
  const ref = useRef();
  const order = "Đặt vé";
  const view = "Xem";
  return (
    <div className='ticket-card minimize br3 pr' ref={ref}>
      <img src={bgTicket} alt="bgbg" className='background' />
      <div className="content-card">
        <h3 className='name'>
          {data.name}
        </h3>
        <div>Phương tiện sử dụng: {VEHICLE[data.vehicle].label}</div>
        <div>{data.countLocation && data.countLocation > 0 ? `Sử dụng tại ${data.countLocation - 1} địa điểm khác` : "Chưa hỗ trợ sử dụng ở địa điểm khác"}</div>
        <div className='action'>
          <Link to={"/ticket/" + data.ticketId}>
            <Button type='primary' className="animated-btn">{view.split('').map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}</Button>
          </Link>
          <Link to={"/order/" + data.ticketId}>
            <Button color="danger" variant="solid" className="animated-btn">{order.split('').map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TicketCardMinimize
