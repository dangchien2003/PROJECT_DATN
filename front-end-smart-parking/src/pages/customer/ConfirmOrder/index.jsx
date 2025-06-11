import ChildContent from '@/components/layout/Customer/ChildContent';
import './style.css'
import StepOrder from '../OrderTicket/StepOrder';
import { Button, Col, Flex, Row } from 'antd';
import { IoTicket, IoWarning } from 'react-icons/io5';
import { FaLocationDot } from 'react-icons/fa6';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';
import logo from '@image/logo_parking.png'
import ItemBill from './ItemBill';
import { useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/payment/1");
  }

  return (
    <div className='confirm-order'>
      <ChildContent backgroundColor='#f0f0f0'>
        <StepOrder current={1} />
      </ChildContent>
      <ChildContent backgroundColor='#f0f0f0' className='padding-footer'>
        <Row gutter={16}>
          <Col lg={16} md={24} className='item-col'>
            <div>
              <div className='title-box br3'>Thông tin tổng quan</div>
              <div className='content-box bw br3 pr0'>
                <div className='item-info'>
                  <span className='label-name'><IoTicket className='icon' />Bạn đang mua vé: </span>
                  <span className='value-label'><b>Vé vip</b></span>
                </div>
                <div className='item-info'>
                  <div className='child'>
                    <span className='label-name'><FaLocationDot className="icon" />Sử dụng cho địa điểm: </span>
                    <span className='value-label'><b>EAON MALL Hà Đông</b></span>
                  </div>
                  <div>
                    <span className='label-name'><span className='icon empty'></span>Địa chỉ: </span>
                    <span className='value-label'><b>Nguyễn Xá, Minh Khai, Bắc Từ Liêm, Hà Nội</b></span>
                  </div>
                </div>
                <div className='item-info'>
                  <span className='label-name'><MdOutlineAccessTimeFilled className='icon' />Hạn sử dụng: </span>
                  <span className='value-label'>Từ <b>05/06/2025 11:30</b> đến <b>06/06/2025 11:30</b></span>
                </div>
                <div className='item-info break owner'>
                  <span className='label-name'><FaUserAlt className="icon" />Chủ sở hữu: </span>
                  <p className='warning child'><IoWarning className='icon warning' /> Người dùng dưới đây sẽ được toàn quyền sử dụng mọi chức năng với vé được mua hộ</p>
                  <span className='value-label'>
                    <ol>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                      <li>chienboy03@gmial.com - <b>lê đăng chiến</b></li>
                    </ol>
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={8} md={24}>
            <div>
              <div className='title-box br3'>Đơn giá</div>
              <div className='content-box bw br3 bill'>
                <Flex justify='center'>
                  <img src={logo} alt="logo" className='logo' />
                </Flex>
                <h2 className='build-title'>Hoá đơn thanh toán</h2>
                <ItemBill label={"Thời gian"} value={"11/11/2025 11:11"} />
                <ItemBill label={"Người thanh toán"} value={"Lê Đăng Chiến"} />
                <ItemBill label={"Email"} value={"chienboy03@gmail.com"} />
                <ItemBill label={"Hạn từ"} value={"11/11/2025 12:00"} />
                <ItemBill label={"Đến"} value={"12/11/2025 12:00"} />
                <ItemBill label={"Số lượng"} value={"10"} />
                <ItemBill label={"Đơn giá"} value={<span>20.000<sup>Đ</sup></span>} />
                <div className='total'>
                  <ItemBill label={"Thành tiền"} value={<span>200.000<sup>Đ</sup></span>} />
                </div>
                <div className='action'>
                  <Button onClick={handleNext} color="primary" variant="solid">Thực hiện thanh toán</Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </ChildContent>
    </div>
  );
};

export default ConfirmOrder;