import { CARD_STATUS, CARD_TYPE } from '@/utils/constants';
import { Card } from 'antd';
import dayjs from "dayjs";
import { Link } from 'react-router-dom';
import DotStatus from '../DotStatus';
import TitleItemCard from '../TitleItemCard';
import './style.css';

const CardCustom = ({ isAdmin, parentRef, data = {} }) => {
  return (
    <div style={{ display: 'flex' }} className='card'>
      <Card
        title={<TitleItemCard isAdmin={isAdmin} parentRef={parentRef} status={Number(data.status)} />}
        bordered={false}
        bodyStyle={{ paddingTop: 24 }}
        className='card-item'
      >
        <div className="body">
          <div className='info'>
            <span>Số thẻ: </span>
            <span className='card-number'>{data.numberCard}</span>
          </div>
          {isAdmin && <>
            <div className='info'>Chủ sở hữu: <Link to={"/account/customer/1"} style={{ color: "white", textDecoration: "underline" }}>{data.owner}</Link></div>
            <div className='info'>Loại thẻ: {CARD_TYPE[data.type].label}</div>
          </>}
          <div className='info'>Lần cấp: {data.issuedTimes}</div>
          <div className='info'>Ngày cấp: {dayjs(data.issuedDate).format("DD/MM/YYYY")}</div>
          <div className='info'>Thời hạn: {!data.expireDate ? "Vô hạn" : dayjs(data.expireDate).format("DD/MM/YYYY")}</div>
          <div className='info'>Số lần sử dụng: {data.usedTimes}</div>
          <div className='info'>
            <span>Trạng thái: </span>
            <span className={CARD_STATUS[data.status].color}><DotStatus /></span>
            <span>{CARD_STATUS[data.status].label}</span>
          </div>
          <div className='info'>
            Đang liên kết với vé: <Link to={isAdmin ? "/demo" : "/"} style={{ color: "white", textDecoration: "underline" }}>{data.ticketLink}</Link>
          </div>
          {isAdmin && <>
            <div>Người yêu cầu: <Link to={"/account/customer/1"} style={{ color: "white", textDecoration: "underline" }}>{data.requestName}</Link></div>
            <div>Ngày yêu cầu: {dayjs(data.created).format("DD/MM/YYYY")}</div>
          </>}
        </div>
      </Card >
    </div >
  )
}

export default CardCustom
