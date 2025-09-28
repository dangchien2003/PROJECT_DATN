import ChildContent from '@/components/layout/Customer/ChildContent'
import { useSelectMenu } from '@/hook/useSelectMenu'
import { MENU_CUSTOMER_ID } from '@/utils/constants'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import bg from "./bg.png"
import './style.css'

const Introduce = () => {
  const { select } = useSelectMenu();
  select(MENU_CUSTOMER_ID.GIOI_THIEU);
  return (
    <div className='intro'>

      {/* Banner */}
      <ChildContent>
        <section className="banner br3" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'contain' }}>
          <div className="banner-content">
            <h1>Giải pháp gửi xe thông minh</h1>
            <p style={{ fontSize: 14 }}>
              <div>Trải nghiệm gửi xe hiện đại, tiện lợi chỉ với vài thao tác trực tuyến</div>
              <div style={{paddingTop: 8}}>👉Đặt vé ngay hôm nay để không còn lo ngại ùn tắc và chờ đợi</div>
            </p>
            <Link to={"/authen"}>
              <Button type="primary" className="btn">Đăng ký ngay</Button>
            </Link>
          </div>
        </section>
      </ChildContent>

      {/* Giới thiệu */}
      <ChildContent>
        <section className="section br3">
          <h2>GIỚI THIỆU</h2>
          <p>
            <div>Website bán vé gửi xe tự động mang đến cho khách hàng trải nghiệm gửi xe hiện đại:</div>
            <div style={{ display: "inline-block", textAlign: "left" }}>
              <ul style={{listStyle: "none"}}>
                <li style={{paddingTop: 16}}>
                  ⏰ <b>Nhanh chóng</b>: Đặt vé và thanh toán trực tuyến
                </li>
                <li style={{paddingTop: 16}}>
                 📊 <b>Minh bạch</b>: Giá vé và trình trạng bãi đỗ công khai
                </li>
                <li style={{paddingTop: 16}}>
                  🚗 <b>Tiện lợi</b>: Quản lý vé và thông tin gửi xe ngay trên điện thoại
                </li>
                <li style={{paddingTop: 16}}>
                  𖣯 <b>Hiện đại</b>: Trình vé bằng mã QR hoặc thẻ thông minh
                </li>
              </ul>
            </div>
            <div style={{ paddingTop: 16 }}> <span style={{fontSize: 20}}>➥</span> Giải pháp giúp khách hàng <b>tiết kiệm thời gian, an tâm khi sử dụng</b> và góp phần thúc đẩy <b>chuyển đổi số trong giao thông đô thị</b></div>
          </p>
        </section>
      </ChildContent>
      {/* Tính năng chính */}
      <ChildContent>
        <section className="features br3">
          <h2>TÍNH NĂNG CHÍNH</h2>
          <div className="feature-list">
            <div className="feature-item">
              <img src={"/worldwide.png"} alt="Gửi xe" />
              <h3>Đặt vé trực tuyến</h3>
              <p>Tìm kiếm bãi đỗ, đặt chỗ và thanh toán online.</p>
            </div>
            <div className="feature-item">
              <img src={"/wallet.png"} alt="Thanh toán" />
              <h3>Thanh toán online</h3>
              <p>Thanh toán qua ví điện tử, ngân hàng</p>
            </div>
            <div className="feature-item">
              <img src={"/easy.png"} alt="Toàn quốc" />
              <h3>Quản lý vé thông minh</h3>
              <p>Phân loại, tìm kiếm thông minh. Không lo đánh cắp</p>
            </div>
          </div>
        </section>
      </ChildContent>
      <ChildContent>
        {/* Đối tác */}
        <section className="partners br3">
          <h2>ĐỐI TÁC CHIẾN LƯỢC</h2>
          <p>Hợp tác với nhiều bãi đỗ xe tại đô thị, trung tâm thương mại, trường học</p>
          <p>Hỗ trợ hơn 500 điểm gửi xe trên toàn quốc</p>
          <div className="partner-logos">
            <img src={"/beta.jpg"} alt="beta" />
            <img src={"/go.png"} alt="go" />
            <img src={"/vincom.png"} alt="vincom" />
            <img src={"/aeon-malljpg.jpg"} alt="aeon" />
            <img src={"/cndajfif.jfif"} alt="cndajfif" />
            <img src={"/dhbachkhoa.png"} alt="dhbachkhoa" />
            <img src={"/dhtm.jpg"} alt="dhtm" />
            <img src={"/cdfptpng.png"} alt="cdfptpng" />
          </div>
        </section>
      </ChildContent>
    </div>
  )
}

export default Introduce
