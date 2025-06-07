import React from 'react'
import './style.css'
import bg from "./bg.png"
import { Button } from 'antd'
import ChildContent from '@/components/layout/Customer/ChildContent'

const Introduce = () => {
  return (
    <div className='intro'>

      {/* Banner */}
      <ChildContent>
        <section className="banner br3" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'contain'}}>
          <div className="banner-content">
            <h1>Giải pháp gửi xe thông minh</h1>
            <p>Dễ dàng gửi phương tiện chỉ bằng chiếc điện thoại</p>
            <Button type="primary" className="btn">Đăng ký ngay</Button>
          </div>
        </section>
      </ChildContent>

      {/* Giới thiệu */}
      <ChildContent>
        <section className="section br3">
          <h2>GIỚI THIỆU</h2>
          <p>Trung thành phát tuân quan trị và hiện trưởng đưa nhưn om trộm chể trong mang về</p>
          <h3>Chính hướng</h3>
          <p>Sáng tạc hệ iquc aụy những toàon các gọi thường, an to vùng vồi do thượng thông muối</p>
        </section>
      </ChildContent>
      {/* Tính năng chính */}
      <ChildContent>
        <section className="features br3">
          <h2>TÍNH NĂNG CHÍNH</h2>
          <div className="feature-list">
            <div className="feature-item">
              <img src={bg} alt="Gửi xe" />
              <h4>Gửi xe qua app</h4>
              <p>Check-in/out không cần thẻ, đơn giản và thuận tiện thông qua ứng dụng</p>
            </div>
            <div className="feature-item">
              <img src={bg} alt="Thanh toán" />
              <h4>Báo cáo và thanh toán</h4>
              <p>Thống kê chi tiết gửi xe và báo cáo tài chính thuận tiện</p>
            </div>
            <div className="feature-item">
              <img src={bg} alt="Toàn quốc" />
              <h4>Hợp tác toàn quốc</h4>
              <p>Kết nối với hệ sinh thái đối tác hơn 500 bãi đỗ trên toàn quốc</p>
            </div>
          </div>
        </section>
      </ChildContent>
      <ChildContent>
        {/* Đối tác */}
        <section className="partners br3">
          <h2>ĐỐI TÁC CHIẾN LƯỢC</h2>
          <p>Hợp tác cùng hơn 500 điểm gửi xe trên toàn quốc</p>
          <div className="partner-logos">
            <img src={bg} alt="AEON" />
            <img src={bg} alt="FPT" />
            <img src={bg} alt="Vingroup" />
            <img src={bg} alt="REE" />
          </div>
        </section>
      </ChildContent>
    </div>
  )
}

export default Introduce
