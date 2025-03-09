import { Card } from 'antd'
import DotStatus from '../DotStatus'
import './style.css'
import TitleItemCard from '../TitleItemCard';
import { CARD_TYPE } from '@/utils/constants';
import { Link } from 'react-router-dom';

const CardCustom = ({isAdmin, isWaitApprove}) => {
  const ticketLink = "TICKET12421412412";
  const type = 0;
  return (
    <div style={{ display: 'flex' }}>
      <Card
        title={<TitleItemCard isAdmin={isAdmin}/>}
        bordered={false}
        style={{
          width: 500,
          background: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSvFGCBzmWJ6kLtUB66UtRHWweI2FsSseezA&s")`,
          backgroundSize: 'cover',
          color: 'white',
          fontSize: 16
        }}
        bodyStyle={{ paddingTop: 24 }}
      >
        <div className="body">
          {!isWaitApprove && <div>
            <span>Số thẻ: </span>
            <span style={{ fontSize: 20 }}>012345678900</span>
          </div>}
          {isAdmin && <>
            <div>Chủ sở hữu: <Link to={"/account/customer/1"} style={{color: "white", textDecoration: "underline"}}>LÊ ĐĂNG CHIẾN</Link></div>
            <div>Loại thẻ: {CARD_TYPE[type].label}</div>
          </>}
          <div>{isWaitApprove ? "Lần yêu cầu" : "Lần cấp"}: 1</div>
          {!isWaitApprove && <>
            <div>Ngày cấp: 18/01/2025</div>
            <div>Thời hạn: Vô hạn</div>
            <div>Số lần sử dụng: 500</div>
          </>}
          <div>
            <span>Trạng thái: </span>
            <DotStatus />
            <span>Đang hoạt động</span>
          </div>
          {ticketLink && !isWaitApprove && 
            <div>
              Đang liên kết với id vé: <Link to={isAdmin ? "/demo": "/"} style={{color: "white", textDecoration: "underline"}}>{ticketLink}</Link>
            </div>
          }
          {isAdmin && <>
            <div>Người yêu cầu: <Link to={"/account/customer/1"} style={{color: "white", textDecoration: "underline"}}>LÊ ĐĂNG CHIẾN</Link></div>
            <div>Ngày yêu cầu: 20/10/2003</div>
          </>}
        </div>
      </Card>
    </div>
  )
}

export default CardCustom
