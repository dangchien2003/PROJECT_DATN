import { Card } from 'antd'

import DotStatus from '../DotStatus'
import './style.css'
import TitleItemCard from '../TitleItemCard';

const CardCustom = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Card
        title={<TitleItemCard />}
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
          <div>
            <span>Số thẻ: </span>
            <span style={{ fontSize: 20 }}>012345678900</span>
          </div>
          <div>Lần cấp: 1</div>
          <div>Ngày cấp: 18/01/2025</div>
          <div>Thời hạn: Vô hạn</div>
          <div>Số lần sử dụng: 500</div>
          <div>
            <span>Trạng thái: </span>
            <DotStatus />
            <span>Đang hoạt động</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CardCustom
