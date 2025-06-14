import { CARD_TYPE } from '@/utils/constants';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import DotStatus from '../DotStatus';
import TitleItemCard from '../TitleItemCard';
import './style.css';

const CardCustom = ({ isAdmin, isWaitApprove, parentRef }) => {
  const ticketLink = "TICKET12421412412";
  const type = 0;
  return (
    <div style={{ display: 'flex' }} className='card'>
      <Card
        title={<TitleItemCard isAdmin={isAdmin} parentRef={parentRef} />}
        bordered={false}
        bodyStyle={{ paddingTop: 24 }}
        className='card-item'
      >
        <div className="body">
          {!isWaitApprove && <div className='info'>
            <span>Số thẻ: </span>
            <span className='card-number'>012345678900</span>
          </div>}
          {isAdmin && <>
            <div className='info'>Chủ sở hữu: <Link to={"/account/customer/1"} style={{ color: "white", textDecoration: "underline" }}>LÊ ĐĂNG CHIẾN</Link></div>
            <div className='info'>Loại thẻ: {CARD_TYPE[type].label}</div>
          </>}
          <div className='info'>Lần cấp: 1</div>
          <div className='info'>Ngày cấp: 18/01/2025</div>
          <div className='info'>Thời hạn: Vô hạn</div>
          <div className='info'>Số lần sử dụng: 500</div>
          <div className='info'>
            <span>Trạng thái: </span>
            <DotStatus />
            <span>Đang hoạt động</span>
          </div>
          {ticketLink && !isWaitApprove &&
            <div className='info'>
              Đang liên kết với id vé: <Link to={isAdmin ? "/demo" : "/"} style={{ color: "white", textDecoration: "underline" }}>{ticketLink}</Link>
            </div>
          }
          {isAdmin && <>
            <div>Người yêu cầu: <Link to={"/account/customer/1"} style={{ color: "white", textDecoration: "underline" }}>LÊ ĐĂNG CHIẾN</Link></div>
            <div>Ngày yêu cầu: 20/10/2003</div>
          </>}
        </div>
      </Card >
    </div >
  )
}

export default CardCustom
