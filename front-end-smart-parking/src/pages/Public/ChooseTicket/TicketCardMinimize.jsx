import { useRef } from 'react'
import bgTicket from './cut2.png'
import { Button } from 'antd'
import { FaMotorcycle } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const TicketCardMinimize = () => {
  const ref = useRef();
  const order = "Đặt vé";
  const view = "Xem";
  return (
    <div className='ticket-card minimize br3 pr' ref={ref}>
      <img src={bgTicket} alt="bgbg" className='background' />
      <div className="content-card">
        <h3 className='name'>
          Vé vip
        </h3>
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
          <Link to={"/order/53"}>
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
