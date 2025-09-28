import { Link } from 'react-router-dom';
import './style.css';

const Footer = () => {
  return (
    <footer>
      <div class="footer-container">
        <div>
          <h2>Smart Parking</h2>
          <p>Giải pháp gửi xe thông minh, tiện lợi và hiện đại.</p>
        </div>
        <div class="footer-links">
          <h3>Liên kết</h3>
          <ul>
            <li><Link to="/#">Giới thiệu</Link></li>
            <li><Link to="/choose/location">Đặt vé</Link></li>
          </ul>
        </div>
        <div>
          <h3>Liên hệ</h3>
          <p>Email: support@smartparking.vn</p>
          <p>Hotline: 1900 8888 88</p>
        </div>
      </div>
      <div class="footer-bottom">
        © 2025 Smart Parking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;